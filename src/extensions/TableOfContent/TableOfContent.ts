/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { NodeViewTableOfContent } from '@/extensions/TableOfContent/components/NodeViewTableOfContent';
import { TableOfContentActionButton } from '@/extensions/TableOfContent/components/TableOfContentActionButton';
import { findNode, isTitleNode } from '@/utils/node';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContents: {
      setTableOfContents: () => ReturnType;
      removeTableOfContents: () => ReturnType;
    };
  }
}

interface Options {
  onHasOneBeforeInsert?: () => void;
}

export const TableOfContents = /* @__PURE__ */ Node.create<Options>({
  name: 'tableOfContents',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      ...this.parent?.(),
      onHasOneBeforeInsert: () => {
        return;
      },
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
      button: ({ editor, t }: any) => ({
        component: TableOfContentActionButton,
        componentProps: {
          disabled: false,
          icon: 'BookMarked',
          tooltip: t('editor.table_of_content'),
          editor,
        },
      }),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'toc',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['toc', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewTableOfContent);
  },

  // @ts-expect-error
  addCommands() {
    return {
      setTableOfContents:
        () =>
          ({ commands, editor, view }) => {
            const nodes = findNode(editor, this.name);

            if (nodes.length > 0) {
            // @ts-expect-error
              this.options.onHasOneBeforeInsert();
              return;
            }

            const titleNode = view.props.state.doc.content.firstChild as any;

            if (isTitleNode(titleNode)) {
              const pos =
              ((titleNode.firstChild && titleNode.firstChild.nodeSize) || 0) +
              1;
              return commands.insertContentAt(pos, { type: this.name });
            }

            return commands.insertContent({
              type: this.name,
            });
          },
      removeTableOfContents:
        () =>
          ({ state, dispatch }: any) => {
            const { tr } = state;
            const nodeType = state.schema.nodes.tableOfContents;

            state.doc.descendants((node: any, pos: any) => {
              if (node.type === nodeType) {
                const from = pos;
                const to = pos + node.nodeSize;
                tr.delete(from, to);
              }
            });

            if (tr.docChanged) {
              dispatch(tr);
              return true;
            }

            return false;
          },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ];
  },
});
