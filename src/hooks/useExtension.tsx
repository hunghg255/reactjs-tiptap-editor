import { useMemo } from 'react';

import { useEditorInstance } from '@/store/editor';

export function useExtension(extensionName: string) {
  const editor = useEditorInstance();

  return useMemo(() => {
    if (!editor) {
      return null;
    }
    const extension = editor.extensionManager.extensions.find(extension => extension.name === extensionName);

    return extension;
  }, [editor, extensionName]);
}
