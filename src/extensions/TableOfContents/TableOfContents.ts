import { Node, mergeAttributes } from '@tiptap/core';
import {
  TableOfContents as TiptapTableOfContents,
  getHierarchicalIndexes,
} from '@tiptap/extension-table-of-contents';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ActionButton } from '@/components';
import { NodeViewTableOfContents } from '@/extensions/TableOfContents/components/NodeViewTableOfContents';

import type { GeneralOptions } from '@/types';
import type { TableOfContentsOptions as TiptapTableOfContentsOptions } from '@tiptap/extension-table-of-contents';

export type {
  TableOfContentData,
  TableOfContentDataItem,
} from '@tiptap/extension-table-of-contents';
export { getHierarchicalIndexes, getLinearIndexes } from '@tiptap/extension-table-of-contents';

export * from './components/RichTextTableOfContents';
export * from './components/useTableOfContents';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContentsNode: {
      /**
       * Insert a table of contents block at the current selection.
       */
      insertTableOfContents: () => ReturnType;
    };
  }
}

export interface TableOfContentsNodeOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface TableOfContentsOptions
  extends TiptapTableOfContentsOptions, GeneralOptions<TableOfContentsOptions> {
  /**
   * HTML attributes applied to the table of contents block.
   */
  HTMLAttributes: Record<string, unknown>;
}

/**
 * Block node that renders the headings collected by the `tableOfContents`
 * extension. It is registered automatically by `TableOfContents`.
 */
export const TableOfContentsNode =
  /* @__PURE__ */ Node.create<TableOfContentsNodeOptions>({
    name: 'tableOfContentsNode',
    group: 'block',
    atom: true,
    selectable: true,
    draggable: true,

    addOptions() {
      return {
        HTMLAttributes: {
          class: 'table-of-contents',
        },
      };
    },

    parseHTML() {
      return [{ tag: 'div[data-type="table-of-contents"]' }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          'data-type': 'table-of-contents',
        }),
      ];
    },

    addCommands() {
      return {
        insertTableOfContents:
          () =>
          ({ commands }) => {
            return commands.insertContent({ type: this.name });
          },
      };
    },

    addNodeView() {
      return ReactNodeViewRenderer(NodeViewTableOfContents);
    },
  });

/**
 * Tracks headings in the document and exposes them through
 * `editor.storage.tableOfContents.content`. Also registers the
 * `tableOfContentsNode` block so a live table of contents can be inserted
 * into the document.
 */
export const TableOfContents =
  /* @__PURE__ */ TiptapTableOfContents.extend<TableOfContentsOptions>({
    // @ts-expect-error
    addOptions() {
      return {
        ...this.parent?.(),
        getIndex: getHierarchicalIndexes,
        HTMLAttributes: {
          class: 'table-of-contents',
        },
        button: ({ editor, t }) => ({
          component: ActionButton,
          componentProps: {
            action: () => editor.chain().focus().insertTableOfContents().run(),
            isActive: () => editor.isActive(TableOfContentsNode.name) || false,
            disabled: false,
            icon: 'TableOfContents',
            tooltip: t('editor.tableofcontents.tooltip'),
          },
        }),
      };
    },

    addExtensions() {
      return [
        TableOfContentsNode.configure({
          HTMLAttributes: this.options.HTMLAttributes,
        }),
      ];
    },
  });
