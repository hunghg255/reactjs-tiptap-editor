import { Node, mergeAttributes } from '@tiptap/core';

import { TextSelection } from '@tiptap/pm/state';

import { addOrDeleteCol, createColumns, gotoCol } from '@/utils/columns';
import { Extension } from '@tiptap/core';

const EXTENSION_PRIORITY_HIGHEST = 200;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (attrs?: { cols: number }) => ReturnType
      addColBefore: () => ReturnType
      addColAfter: () => ReturnType
      deleteCol: () => ReturnType
    }
  }
}

export * from './components/RichTextColumn';

export const Column = Extension.create<any>({
  name: 'richtextColumnExtension',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: any) => ({
        componentProps: {
          action: () => {
            editor.chain().focus().insertColumns({ cols: 2 }).run();
          },
          icon: 'Columns',
          tooltip: t('editor.columns.tooltip'),
        },
      }),
    };
  },
});

export const ColumnNode = /* @__PURE__ */ Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'column',
      },
    };
  },

  addAttributes() {
    return {
      index: {
        default: 0,
        parseHTML: element => element.getAttribute('index'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=column]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

export const MultipleColumnNode = /* @__PURE__ */ Node.create({
  name: 'columns',
  group: 'block',
  defining: true,
  isolating: true,
  allowGapCursor: false,
  content: 'column{1,}',
  priority: EXTENSION_PRIORITY_HIGHEST,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'columns',
      },
    };
  },

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: element => element.getAttribute('cols'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=grid]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      insertColumns:
        attrs =>
          ({ tr, dispatch, editor }) => {
            const node = createColumns(editor.schema, (attrs && attrs.cols) || 3);

            if (dispatch) {
              const offset = tr.selection.anchor + 1;

              tr.replaceSelectionWith(node)
                .scrollIntoView()
                .setSelection(TextSelection.near(tr.doc.resolve(offset)));
            }

            return true;
          },
      addColBefore:
        () =>
          ({ dispatch, state }) => {
            return addOrDeleteCol({ dispatch, state, type: 'addBefore' });
          },
      addColAfter:
        () =>
          ({ dispatch, state }) => {
            return addOrDeleteCol({ dispatch, state, type: 'addAfter' });
          },
      deleteCol:
        () =>
          ({ dispatch, state }) => {
            return addOrDeleteCol({ dispatch, state, type: 'delete' });
          },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-G': () => this.editor.commands.insertColumns(),
      'Tab': () => {
        return gotoCol({
          state: this.editor.state,
          dispatch: this.editor.view.dispatch,
          type: 'after',
        });
      },
      'Shift-Tab': () => {
        return gotoCol({
          state: this.editor.state,
          dispatch: this.editor.view.dispatch,
          type: 'before',
        });
      },
    };
  },
});
