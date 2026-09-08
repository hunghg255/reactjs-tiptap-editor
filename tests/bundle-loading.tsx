import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import 'easydrawer/styles.css';

import { emit } from '../src/components/ReactBus';
import { RichTextProvider } from '../src/components/RichTextProvider';
import { EditDrawerBlock } from '../src/extensions/Drawer/components/EditDrawerBlock';
import { Drawer, RichTextDrawer } from '../src/extensions/Drawer/Drawer';
import { ExportWord } from '../src/extensions/ExportWord/ExportWord';
import { Image } from '../src/extensions/Image/Image';
import { ImportWord, RichTextImportWord } from '../src/extensions/ImportWord/ImportWord';
import { Video } from '../src/extensions/Video/Video';
import { EVENTS } from '../src/utils/customEvents/events.constant';

const results = document.querySelector('#results')!;
const passed: string[] = [];
const editor = new Editor({
  extensions: [Document, Paragraph, Text, Image, Video, Drawer, ExportWord, ImportWord],
  content: '<p>Bundle loading round trip</p>',
});
const secondEditor = new Editor({
  extensions: [Document, Paragraph, Text, Image, Video],
  content: '<p>Second editor</p>',
});

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
  passed.push(`PASS ${message}`);
  results.textContent = passed.join('\n');
}

async function waitFor<T>(read: () => T, message: string): Promise<NonNullable<T>> {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const value = read();
    if (value) return value as NonNullable<T>;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out: ${message}`);
}

function dialog() {
  return document.querySelector<HTMLElement>('[role="dialog"]');
}
function closeDialog() {
  const button = Array.from(dialog()!.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === 'Close'
  );
  if (!button) throw new Error('Dialog close button missing');
  button.click();
}

async function run() {
  await waitFor(
    () => editor.id && secondEditor.id && editor.id !== secondEditor.id,
    'provider IDs'
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  check(!dialog(), 'no dialog opened on mount');

  emit(EVENTS.UPLOAD_IMAGE(editor.id), true);
  await waitFor(() => dialog()?.textContent?.includes('Add an image'), 'first image dialog event');
  check(
    document.querySelectorAll('[role="dialog"]').length === 1,
    'first image event survives lazy loading and targets one editor'
  );
  closeDialog();
  await waitFor(() => !dialog(), 'close image');
  emit(EVENTS.UPLOAD_IMAGE(editor.id), true);
  await waitFor(() => dialog(), 'reopen image');
  check(true, 'image dialog reopens from the cached module');
  closeDialog();
  await waitFor(() => !dialog(), 'close image again');

  emit(EVENTS.UPLOAD_VIDEO(secondEditor.id), true);
  await waitFor(() => dialog()?.textContent?.includes('Embed or upload a video'), 'video event');
  check(
    document.querySelectorAll('[role="dialog"]').length === 1,
    'video dialog opens in the second editor'
  );
  closeDialog();
  await waitFor(() => !dialog(), 'close video');

  const originalCreate = URL.createObjectURL;
  const originalClick = HTMLAnchorElement.prototype.click;
  let exported: Blob | undefined;
  URL.createObjectURL = (blob) => {
    if (blob instanceof Blob) exported = blob;
    return originalCreate(blob);
  };
  HTMLAnchorElement.prototype.click = () => {};
  try {
    check(editor.can().exportToWord(editor.state.doc), 'Word can() returns a boolean');
    await new Promise((resolve) => setTimeout(resolve, 150));
    check(!exported, 'Word can() does not create a download');
    check(editor.commands.exportToWord(editor.state.doc), 'Word command accepts deferred export');
    const blob = await waitFor(() => exported, 'Word download');
    check(blob.size > 0, 'deferred export creates a nonempty DOCX');

    editor.commands.setContent('<p>Replace this text</p>');
    const transfer = new DataTransfer();
    transfer.items.add(new File([blob], 'bundle-audit.docx'));
    const input = document.querySelector<HTMLInputElement>(
      '[data-test="import-word"] input[type="file"]'
    )!;
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => editor.getText().includes('Bundle loading round trip'), 'Word import');
    check(
      !editor.getText().includes('Replace this text'),
      'lazy Word import restores the exported text'
    );
  } finally {
    URL.createObjectURL = originalCreate;
    HTMLAnchorElement.prototype.click = originalClick;
  }

  async function saveDrawing(selector: string) {
    document.querySelector<HTMLButtonElement>(selector)!.click();
    const save = await waitFor(
      () =>
        Array.from(dialog()?.querySelectorAll('button') || []).find(
          (button) => button.textContent?.trim() === 'Save changes' && !button.disabled
        ),
      'Drawer initialization'
    );
    check(!!dialog()?.querySelector('svg'), 'Drawer controls render after the lazy module loads');
    save.click();
    await waitFor(() => !dialog(), 'save Drawer');
  }
  await saveDrawing('[data-test="drawer"] button');
  check(
    editor.getJSON().content?.some((node) => node.type === Drawer.name),
    'Drawer saves a node'
  );
  await saveDrawing('[data-test="drawer"] button');
  check(true, 'Drawer closes and reinitializes on reopen');
  await saveDrawing('[data-test="edit-drawer"] button');
  check(editor.getHTML().includes('drawer'), 'edit Drawer loads existing SVG and saves');
  results.textContent = `${passed.join('\n')}\n\nALL ${passed.length} CHECKS PASSED`;
}

function App() {
  useEffect(() => {
    void run().catch((error) => {
      results.textContent = `${passed.join('\n')}\nFAIL ${String(error)}`;
    });
  }, []);
  return (
    <>
      <RichTextProvider editor={editor}>
        <EditorContent editor={editor} />
        <div data-test='import-word'>
          <RichTextImportWord />
        </div>
        <div data-test='drawer'>
          <RichTextDrawer />
        </div>
        <div data-test='edit-drawer'>
          <EditDrawerBlock
            editor={editor}
            attrs={{
              align: 'center',
              alt: encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M10 10 L90 90" stroke="black" /></svg>'
              ),
            }}
          />
        </div>
      </RichTextProvider>
      <RichTextProvider editor={secondEditor}>
        <EditorContent editor={secondEditor} />
      </RichTextProvider>
    </>
  );
}

createRoot(document.querySelector('#root')!).render(<App />);
