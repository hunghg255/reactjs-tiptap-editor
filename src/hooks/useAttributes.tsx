import { useEditorState } from '@tiptap/react';

import type { Editor } from '@tiptap/core';

export function useAttributes<T, R = T>(
  editor: Editor,
  attrbute: string,
  defaultValue?: T,
  map?: (arg: T) => R
) {
  return useEditorState({
    editor,
    selector: () => {
      const attrs: Record<string, unknown> = {
        ...defaultValue,
        ...editor.getAttributes(attrbute),
      };

      for (const key of Object.keys(attrs)) {
        if (attrs[key] === null || attrs[key] === undefined) {
          attrs[key] = defaultValue ? (defaultValue as Record<string, unknown>)[key] : null;
        }
      }

      return map ? map(attrs as T) : (attrs as R);
    },
  });
}
