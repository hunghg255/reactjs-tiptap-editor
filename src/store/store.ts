import { createSignal, useSetSignal, useSignalValue } from 'reactjs-signal';

const editableEditorSignal = createSignal<boolean>(false);

function useEditableEditor() {
  return useSignalValue(editableEditorSignal);
}

function useStoreEditableEditor() {
  return useSetSignal(editableEditorSignal);
}

export { useStoreEditableEditor, useEditableEditor };
