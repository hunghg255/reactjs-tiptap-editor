import type { Editor } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';

export interface UseEditorStateReturn {
  isReady: boolean
  editor: Editor | null
  editorRef: React.MutableRefObject<{ editor: Editor | null }>
}

export function useEditorState(): UseEditorStateReturn {
  const editorRef = useRef<{ editor: Editor | null }>({ editor: null });
  const [isReady, setIsReady] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current?.editor) {
      setIsReady(true);
      setEditor(editorRef.current.editor);
    }
  }, [editorRef, editorRef.current?.editor]);

  return { isReady, editor, editorRef };
}
