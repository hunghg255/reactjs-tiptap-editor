/* eslint-disable indent */
/* eslint-disable import/named */
import { Command, Extension } from '@tiptap/core';
import { Transaction } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';

export type TableCellBackgroundOptions = {
  HTMLAttributes: Record<string, any>;
  types?: any;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCellBackground: {
      setTableCellBackground: (color: string) => ReturnType;
      unsetTableCellBackground: () => ReturnType;
    };
  }
}

export const setCellBackgroundMarkup = (
  tr: Transaction,
  pos: number,
  backgroundColor: string,
): Transaction => {
  if (!tr.doc) {
    return tr;
  }

  const node = tr.doc.nodeAt(pos);
  if (!node) {
    return tr;
  }

  if (backgroundColor === node.attrs.backgroundColor) {
    return tr;
  }

  const nodeAttrs = {
    ...node.attrs,
    backgroundColor,
  };

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
};

export const updateCellBackground = (
  tr: Transaction,
  options: TableCellBackgroundOptions,
  backgroundColor: string,
): Transaction => {
  const { doc, selection } = tr;

  if (!doc || !selection || !(selection instanceof CellSelection)) {
    return tr;
  }

  selection.forEachCell((node, pos) => {
    tr = setCellBackgroundMarkup(tr, pos, backgroundColor);
  });

  return tr;
};

export const createCellBackgroundCommand = (
  backgroundColor: string,
  options: TableCellBackgroundOptions,
): Command => {
  return ({ tr, state, dispatch }) => {
    const { selection } = state;
    tr = tr.setSelection(selection);
    tr = updateCellBackground(tr, options, backgroundColor);

    if (tr.docChanged) {
      dispatch?.(tr);
      return true;
    }

    return false;
  };
};

// @ts-ignore
export const TableCellBackground = Extension.create<TableCellBackgroundOptions>({
  name: 'tableCellBackground',
  addOptions() {
    return {
      types: ['tableCell'],
      HTMLAttributes: {},
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            parseHTML: (element) => {
              return element.style.backgroundColor || '';
            },
            renderHTML: (attributes) => {
              return !attributes.backgroundColor || attributes.backgroundColor === ''
                ? {}
                : {
                    style: `background-color: ${attributes.backgroundColor}`,
                  };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTableCellBackground: (backgroundColor: string) =>
        createCellBackgroundCommand(backgroundColor, this.options),
      unsetTableCellBackground: () => createCellBackgroundCommand('', this.options),
    };
  },
});
