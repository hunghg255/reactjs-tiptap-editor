import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import { Editor, EditorContext } from '@tiptap/react';
import React, { act, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { useActive, useToggleActive } from '../src/hooks/useActive';
import { useAttributes } from '../src/hooks/useAttributes';
import { useEditorInstance } from '../src/store/editor';
import { EditorEditableReactive } from '../src/store/EditorEditableReactive';
import { useStoreEditableEditor } from '../src/store/store';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const editor = new Editor({
  element: document.querySelector('#editor') as HTMLElement,
  extensions: [
    Document,
    Paragraph.extend({
      addAttributes: () => ({ align: { default: null } }),
    }),
    Text,
    Bold,
    UndoRedo,
  ],
  content: '<p>hello world</p>',
});
const renders = { instance: 0, bold: 0, attrs: 0 };
let bold = false;
let disabled = true;
let undoDisabled = true;
let align = '';
let storageActive = false;
let manualActive = false;
let refresh: () => void;

function InstanceProbe() {
  useEditorInstance();
  renders.instance++;
  return null;
}
function BoldProbe() {
  const editor = useEditorInstance();
  const state = useToggleActive(useCallback(() => editor.isActive('bold'), [editor]));
  bold = state.dataState;
  disabled = state.disabled;
  renders.bold++;
  return null;
}
function UndoProbe() {
  const editor = useEditorInstance();
  undoDisabled = useActive(useCallback(() => editor.can().undo(), [editor])).disabled;
  return null;
}
function AttributesProbe() {
  const editor = useEditorInstance();
  align = useAttributes(editor, 'paragraph', { align: 'left' }).align;
  renders.attrs++;
  return null;
}
function ManualProbe() {
  const state = useToggleActive(useCallback(() => storageActive, []));
  manualActive = state.dataState;
  refresh = state.update;
  return null;
}
function Probes() {
  const setEditable = useStoreEditableEditor();
  useEffect(() => setEditable(true), [setEditable]);
  return (
    <>
      <InstanceProbe />
      <BoldProbe />
      <UndoProbe />
      <AttributesProbe />
      <ManualProbe />
    </>
  );
}

const root = createRoot(document.querySelector('#root')!);
const results: string[] = [];
function check(condition: boolean, label: string) {
  if (!condition) throw new Error(label);
  results.push(`PASS ${label}`);
}

async function run() {
  await act(async () =>
    root.render(
      <EditorContext.Provider value={{ editor }}>
        <Probes />
        <EditorEditableReactive editor={editor} />
      </EditorContext.Provider>
    )
  );
  check(
    !bold && !disabled && undoDisabled && align === 'left',
    `initial toolbar state and attribute defaults: ${JSON.stringify({ bold, disabled, undoDisabled, align })}`
  );
  const baseline = { ...renders };
  for (let i = 0; i < 10; i++)
    await act(async () => {
      editor.commands.insertContent('a');
    });
  check(renders.instance === baseline.instance, 'instance consumers do not render on typing');
  check(renders.bold === baseline.bold, 'unchanged bold state does not render on typing');
  check(renders.attrs === baseline.attrs, 'unchanged attributes do not render on typing');
  check(!undoDisabled, 'undo availability updates after typing');
  await act(async () => {
    editor.commands.toggleBold();
  });
  check(bold, 'stored marks update without moving selection');
  await act(async () => {
    editor.commands.setTextSelection({ from: 1, to: 4 });
  });
  check(!bold, 'selection updates active formatting');
  await act(async () => {
    editor.commands.toggleBold();
  });
  check(bold, 'formatting changes update without selection change');
  await act(async () => {
    editor.commands.updateAttributes('paragraph', { align: 'right' });
  });
  check(align === 'right', 'attribute selector updates on commands');
  await act(async () => {
    editor.commands.undo();
  });
  check(align === 'left', 'attribute selector updates on undo');
  await act(async () => {
    storageActive = true;
    refresh();
  });
  check(manualActive, 'manual refresh supports storage-only actions');
  await act(async () => {
    editor.setEditable(false);
  });
  check(disabled, 'read-only updates disabled state');
  await act(async () => {
    editor.setEditable(true);
  });
  check(!disabled, 'editable state restores controls');
  await act(async () => root.unmount());
  editor.destroy();
  document.querySelector('#results')!.textContent = results.join('\n');
}

run().catch((error) => {
  document.querySelector('#results')!.textContent = `${results.join('\n')}\nFAIL ${error.stack}`;
  console.error(error);
});
