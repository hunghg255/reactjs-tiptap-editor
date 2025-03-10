import { useEffect, useState } from 'react';

import type { Editor } from '@tiptap/core';

export function useExtension(editor: Editor, attrbute: string) {
  const [extension, setExtension] = useState<any>(undefined);

  useEffect(() => {
    const listener = () => {
      const extension = editor.extensionManager.extensions.find(extension => extension.name === attrbute);

      if (!extension) {
        return;
      }

      setExtension(extension as any);
    };

    editor.on('selectionUpdate', listener);
    editor.on('transaction', listener);

    return () => {
      editor.off('selectionUpdate', listener);
      editor.off('transaction', listener);
    };
  }, [editor, attrbute]);

  return extension;
}
