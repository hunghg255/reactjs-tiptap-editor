/* eslint-disable prefer-spread */
import { useEffect, useState } from 'react';

import type { Editor } from '@tiptap/core';

export function useActive(editor: Editor, ...args: any[]) {
  const [active, toggleActive] = useState(false);

  useEffect(() => {
    const listener = () => {
      toggleActive(editor.isActive.apply(editor, args as any));
    };

    editor.on('selectionUpdate', listener);
    editor.on('transaction', listener);

    return () => {
      editor.off('selectionUpdate', listener);
      editor.off('transaction', listener);
    };
  }, [editor, args, toggleActive]);

  return active;
}
