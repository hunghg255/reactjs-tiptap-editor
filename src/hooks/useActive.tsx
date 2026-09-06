import { useEditorState } from '@tiptap/react';
import { useReducer } from 'react';

import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

const fnActiveDefault = () => false;

export function useActive<T = boolean>(isActive: () => T | boolean = fnActiveDefault) {
  const editable = useEditableEditor();
  const editor = useEditorInstance();
  const dataState = useEditorState({
    editor,
    selector: () => {
      const value = isActive();
      return typeof value === 'boolean' ? !value : value;
    },
  });
  const editorDisabled = !editable || !editor;

  return {
    disabled: editorDisabled || (typeof dataState === 'boolean' && dataState),
    dataState,
    editorDisabled,
  };
}

export function useToggleActive(isActive = fnActiveDefault) {
  const editable = useEditableEditor();
  const editor = useEditorInstance();
  // Keep the manual refresh API for actions that only change extension storage.
  const [, update] = useReducer((value: number) => value + 1, 0);
  const dataState = useEditorState({ editor, selector: () => isActive() });
  const editorDisabled = !editable || !editor;

  return {
    disabled: editorDisabled,
    dataState,
    editorDisabled,
    update,
  };
}
