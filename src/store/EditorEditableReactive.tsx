/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

import { useStoreEditableEditor, } from '@/store/store';

export function EditorEditableReactive ({ editor }: any) {
  const setEditable = useStoreEditableEditor();

  useEffect(() => {
    setEditable({
      value: editor?.isEditable
    });
  }, [editor?.isEditable]);

  const onEditableChange = () => {
    setEditable({
      value: editor?.isEditable
    });
  };

  useEffect(() => {
    if (editor) {
      editor.on('update', onEditableChange);
    }

    return () => {
      if (editor) {
        editor.off('update', onEditableChange);
      }
    };
  }, [editor]);

  return <></>;
}
