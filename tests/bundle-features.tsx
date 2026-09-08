import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import 'katex/dist/katex.min.css';

import { RichTextBubbleKatex } from '../src/components/Bubble/RichTextBubbleKatex';
import { RichTextProvider } from '../src/components/RichTextProvider';
import { Emoji, RichTextEmoji } from '../src/extensions/Emoji/Emoji';
import { KatexPreview } from '../src/extensions/Katex/components/KatexPreview';
import { Katex, RichTextKatex } from '../src/extensions/Katex/Katex';

import type { KatexLoader } from '../src/extensions/Katex/katex-loader';

const results = document.querySelector('#results')!;
const passed: string[] = [];
let loaderCalls = 0;
const rendererLoader: KatexLoader = async () => {
  loaderCalls++;
  const [{ default: renderer }] = await Promise.all([
    import('katex'),
    import('katex/contrib/mhchem'),
  ]);
  return renderer;
};
const editor = new Editor({
  extensions: [Document, Paragraph, Text, Katex.configure({ loadKatex: rendererLoader }), Emoji],
  content: '<p>No formula yet</p>',
});

function check(value: unknown, label: string): asserts value {
  if (!value) throw new Error(label);
  passed.push(`PASS ${label}`);
  results.textContent = passed.join('\n');
}
async function waitFor<T>(read: () => T, label: string) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const value = read();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out: ${label}`);
}
function fill(input: HTMLTextAreaElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
async function run() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  check(loaderCalls === 0, 'toolbar and bubble do not load KaTeX on mount');
  document.querySelector<HTMLButtonElement>('[data-test="katex"] button')!.click();
  const input = await waitFor(
    () =>
      document.querySelector<HTMLTextAreaElement>('[role="dialog"] textarea[placeholder="Text"]'),
    'formula dialog'
  );
  fill(input, String.raw`\ce{H2O}`);
  await waitFor(() => document.querySelector('[role="dialog"] .katex'), 'chemistry preview');
  check(loaderCalls === 1, 'dialog loads the configured chemistry renderer once');
  const save = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')
  ).find((button) => button.textContent?.trim() === 'Save changes')!;
  save.click();
  await waitFor(() => document.querySelector('.ProseMirror .katex'), 'saved formula');
  check(loaderCalls === 1, 'node view shares the loaded renderer with the dialog');

  editor.commands.setContent({
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'katex', attrs: { text: '%', macros: null } }] },
    ],
  });
  await waitFor(
    () => document.querySelector('.ProseMirror')?.textContent?.includes('%'),
    'malformed encoding'
  );
  check(true, 'malformed percent encoding does not crash the node view');
  editor.commands.setContent({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'katex',
            attrs: { text: encodeURIComponent(String.raw`\unknown{<img src=x>}`), macros: '' },
          },
        ],
      },
    ],
  });
  await waitFor(
    () => document.querySelector('.ProseMirror')?.textContent?.includes('<img src=x>'),
    'invalid formula fallback'
  );
  check(
    !document.querySelector('.ProseMirror img[src="x"]'),
    'invalid formula fallback is text, not HTML'
  );

  let retryCalls = 0;
  const retryLoader: KatexLoader = async () => {
    if (++retryCalls === 1) throw new Error('Simulated chunk failure');
    return rendererLoader();
  };
  const retryRoot = createRoot(document.querySelector('#retry-root')!);
  retryRoot.render(<KatexPreview text='x^2' loader={retryLoader} />);
  const retry = await waitFor(
    () => document.querySelector<HTMLButtonElement>('#retry-root button'),
    'retry button'
  );
  retry.click();
  await waitFor(() => document.querySelector('#retry-root .katex'), 'retry succeeds');
  check(retryCalls === 2, 'failed renderer can retry successfully');
  retryRoot.unmount();

  editor.commands.setContent('<p></p>');
  check(editor.commands.setEmoji('smile'), 'existing Emoji shortcode command remains available');
  check(
    editor.getJSON().content?.[0].content?.some((node) => node.type === 'emoji'),
    'Emoji keeps its existing node schema'
  );
  editor.commands.setContent(editor.getHTML());
  check(
    editor.getJSON().content?.[0].content?.some((node) => node.type === 'emoji'),
    'Emoji node survives HTML round-trip'
  );
  document.querySelector<HTMLButtonElement>('[data-test="emoji"] button')!.click();
  const search = await waitFor(
    () => document.querySelector<HTMLInputElement>('[data-slot="emoji-picker-search"]'),
    'lazy emoji picker'
  );
  check(!!search, 'Emoji picker mounts after opening');
  search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await waitFor(() => !document.querySelector('[data-slot="emoji-picker-search"]'), 'close picker');
  document.querySelector<HTMLButtonElement>('[data-test="emoji"] button')!.click();
  await waitFor(() => document.querySelector('[data-slot="emoji-picker-search"]'), 'reopen picker');
  check(true, 'Emoji picker can reopen after lazy loading');
  results.textContent = `${passed.join('\n')}\n\nALL ${passed.length} CHECKS PASSED`;
}
function App() {
  useEffect(() => {
    void run().catch((error) => {
      results.textContent = `${passed.join('\n')}\nFAIL ${String(error)}`;
    });
  }, []);
  return (
    <RichTextProvider editor={editor}>
      <EditorContent editor={editor} />
      <div data-test='katex'>
        <RichTextKatex />
      </div>
      <RichTextBubbleKatex />
      <div data-test='emoji'>
        <RichTextEmoji />
      </div>
    </RichTextProvider>
  );
}
createRoot(document.querySelector('#root')!).render(<App />);
