import { useEditorState } from '@tiptap/react';

import type { Editor } from '@tiptap/core';

export interface TableOfContentsItem {
  id: string;
  level: number;
  itemIndex: number;
  textContent: string;
  pos: number;
  isActive: boolean;
  isScrolledOver: boolean;
}

/**
 * Reactive list of headings collected by the `TableOfContents` extension.
 * Returns plain data (no DOM or ProseMirror nodes) so it is cheap to compare
 * and safe to render anywhere, e.g. in a sidebar outside the editor.
 */
export function useTableOfContents(editor: Editor | null): TableOfContentsItem[] {
  return (
    useEditorState({
      editor,
      selector: ({ editor: instance }) => {
        const content = instance?.storage?.tableOfContents?.content ?? [];

        return content.map((item) => ({
          id: item.id,
          level: item.level,
          itemIndex: item.itemIndex,
          textContent: item.textContent,
          pos: item.pos,
          isActive: item.isActive,
          isScrolledOver: item.isScrolledOver,
        })) as TableOfContentsItem[];
      },
    }) ?? []
  );
}

/**
 * Move the cursor to a heading and scroll it into view.
 */
export function scrollToTableOfContentsItem(
  editor: Editor,
  item: Pick<TableOfContentsItem, 'pos'>
) {
  const node = editor.state.doc.nodeAt(item.pos);

  if (!node) {
    return;
  }

  editor
    .chain()
    .focus(undefined, { scrollIntoView: false })
    .setTextSelection(item.pos + 1)
    .run();

  const dom = editor.view.nodeDOM(item.pos);

  if (dom instanceof HTMLElement) {
    dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
