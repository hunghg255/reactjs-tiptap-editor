import { useEffect, useMemo, useState } from 'react';

import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

// isActive (can action) => false => disable true
//                       => true => disable false
const fnActiveDefault = () => false;

export function useActive(isActive = fnActiveDefault) {
  const editable = useEditableEditor();

  const [dataState, setDataState] = useState<any>(() => {
    const r = isActive();

    return typeof r === 'boolean' ? !r : r;
  });
  const editor = useEditorInstance();

  useEffect(() => {
    if (!editor || !isActive) return;

    const listener = () => {
      const r = isActive();

      setDataState(typeof r === 'boolean' ? !r : r);
    };

    listener();

    editor.on('selectionUpdate', listener);
    editor.on('transaction', listener);

    return () => {
      editor.off('selectionUpdate', listener);
      editor.off('transaction', listener);
    };
  }, [editor, isActive]);

  const disabled = useMemo(() => {
    if (!editable || !editor) return true;

    if (typeof dataState === 'boolean') {
      return dataState;
    }

    return false;
  }, [editable, editor, dataState]);

  const editorDisabled = useMemo(() => {
    return !editable || !editor;
  }, [editable, editor]);

  return {
    disabled, // can not action, opacity < 1
    dataState,  // true => show background, false => no background
    editorDisabled
  };
}

/**
 * export type Mark =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "underline"
  | "superscript"
  | "subscript"
 */
// isActive (can action) => false => disable false
//                       => true => disable false
export function useToggleActive(isActive = fnActiveDefault) {
  const editable = useEditableEditor();

  const [v, setUpdate] = useState({});

  const [dataState, setDataState] = useState(isActive());
  const editor = useEditorInstance();

  useEffect(() => {
    if (!editor || !isActive) return;

    const listener = () => {
      setDataState(isActive());
    };

    listener();

    editor.on('selectionUpdate', listener);

    return () => {
      editor.off('selectionUpdate', listener);
    };
  }, [v, editor, isActive]);

  const disabled = useMemo(() => {
    if (!editable || !editor) return true;

    return false;
  }, [editable, editor]);

    const editorDisabled = useMemo(() => {
    return !editable || !editor;
  }, [editable, editor]);

  return {
    disabled, // can not action, opacity < 1
    dataState,  // true => show background, false => no background
    editorDisabled,
    update: () => setUpdate({}), // force update
  };
}
