/* eslint-disable indent */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/prefer-spread */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable import/named */
import { findParentNode, Editor } from '@tiptap/core';
import { Node, ResolvedPos } from '@tiptap/pm/model';
import { EditorState, Selection, Transaction } from '@tiptap/pm/state';
import { CellSelection, TableMap } from '@tiptap/pm/tables';
import { EditorView } from '@tiptap/pm/view';

import { Table } from './table';

export const isRectSelected = (rect: any) => (selection: CellSelection) => {
  const map = TableMap.get(selection.$anchorCell.node(-1));
  const start = selection.$anchorCell.start(-1);
  const cells = map.cellsInRect(rect);
  const selectedCells = map.cellsInRect(
    map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start),
  );

  for (let i = 0, count = cells.length; i < count; i += 1) {
    if (!selectedCells.includes(cells[i])) {
      return false;
    }
  }

  return true;
};

export const findTable = (selection: Selection) =>
  findParentNode((node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table')(
    selection,
  );

export const isCellSelection = (selection: any) => selection instanceof CellSelection;

export const isColumnSelected = (columnIndex: number) => (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));

    return isRectSelected({
      left: columnIndex,
      right: columnIndex + 1,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

export const isRowSelected = (rowIndex: number) => (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));

    return isRectSelected({
      left: 0,
      right: map.width,
      top: rowIndex,
      bottom: rowIndex + 1,
    })(selection);
  }

  return false;
};

export const isTableSelected = (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));

    return isRectSelected({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

export const getCellsInColumn = (columnIndex: number | number[]) => (selection: Selection) => {
  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const indexes: any = Array.isArray(columnIndex) ? columnIndex : [columnIndex];

    return indexes.reduce((acc: any, index: any) => {
      if (index >= 0 && index <= map.width - 1) {
        const cells = map.cellsInRect({
          left: index,
          right: index + 1,
          top: 0,
          bottom: map.height,
        });

        return acc.concat(
          cells.map((nodePos) => {
            const node = table.node.nodeAt(nodePos);
            const pos = nodePos + table.start;

            return { pos, start: pos + 1, node };
          }),
        );
      }

      return acc;
    }, [] as { pos: number; start: number; node: Node | null | undefined }[]);
  }
  return null;
};

export const getCellsInRow = (rowIndex: number | number[]) => (selection: Selection) => {
  const table = findTable(selection);

  if (table) {
    const map = TableMap.get(table.node);
    const indexes = Array.isArray(rowIndex) ? rowIndex : [rowIndex];

    return indexes.reduce((acc, index) => {
      if (index >= 0 && index <= map.height - 1) {
        const cells = map.cellsInRect({
          left: 0,
          right: map.width,
          top: index,
          bottom: index + 1,
        });

        return acc.concat(
          cells.map((nodePos) => {
            const node = table.node.nodeAt(nodePos);
            const pos = nodePos + table.start;
            return { pos, start: pos + 1, node };
          }),
        );
      }

      return acc;
    }, [] as { pos: number; start: number; node: Node | null | undefined }[]);
  }

  return null;
};

export const getCellsInTable = (selection: Selection) => {
  const table = findTable(selection);

  if (table) {
    const map = TableMap.get(table.node);
    const cells = map.cellsInRect({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    });

    return cells.map((nodePos) => {
      const node = table.node.nodeAt(nodePos);
      const pos = nodePos + table.start;

      return { pos, start: pos + 1, node };
    });
  }

  return null;
};

export const findParentNodeClosestToPos = (
  $pos: ResolvedPos,
  predicate: (node: Node) => boolean,
) => {
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i);

    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      };
    }
  }

  return null;
};

export const findCellClosestToPos = ($pos: ResolvedPos) => {
  const predicate = (node: Node) =>
    node.type.spec.tableRole && /cell/i.test(node.type.spec.tableRole);

  return findParentNodeClosestToPos($pos, predicate);
};

const select = (type: 'row' | 'column') => (index: number) => (tr: Transaction) => {
  const table = findTable(tr.selection);
  const isRowSelection = type === 'row';

  if (table) {
    const map = TableMap.get(table.node);

    // Check if the index is valid
    if (index >= 0 && index < (isRowSelection ? map.height : map.width)) {
      const left = isRowSelection ? 0 : index;
      const top = isRowSelection ? index : 0;
      const right = isRowSelection ? map.width : index + 1;
      const bottom = isRowSelection ? index + 1 : map.height;

      const cellsInFirstRow = map.cellsInRect({
        left,
        top,
        right: isRowSelection ? right : left + 1,
        bottom: isRowSelection ? top + 1 : bottom,
      });

      const cellsInLastRow: any =
        bottom - top === 1
          ? cellsInFirstRow
          : map.cellsInRect({
              left: isRowSelection ? left : right - 1,
              top: isRowSelection ? bottom - 1 : top,
              right,
              bottom,
            });

      const head = table.start + cellsInFirstRow[0];
      const anchor = table.start + cellsInLastRow.at(-1);
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      // @ts-ignore
      return tr.setSelection(new CellSelection($anchor, $head));
    }
  }
  return tr;
};

export const selectColumn = select('column');

export const selectRow = select('row');

export const selectTable = (tr: Transaction) => {
  const table = findTable(tr.selection);

  if (table) {
    const { map } = TableMap.get(table.node) as any;

    if (map && map.length > 0) {
      const head = table.start + map[0];
      const anchor = table.start + map.at(-1);
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      // @ts-ignore
      return tr.setSelection(new CellSelection($anchor, $head));
    }
  }

  return tr;
};

export const analyzeCellSelection = (editor: Editor) => {
  const selection = editor.state.selection as CellSelection;

  let cellCount = 0;
  let mergedCellCount = 0;

  selection.forEachCell((cell) => {
    cellCount++;
    if (cell.attrs.colspan > 1 || cell.attrs.rowspan > 1) {
      mergedCellCount++;
    }
  });

  return {
    isRowSelection: selection.isRowSelection(),
    isColSelection: selection.isColSelection(),
    cellCount,
    mergedCellCount,
  };
};

export const isTableCellSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement;
  const nodeDOM = view.nodeDOM(from) as HTMLElement;
  const node = nodeDOM || domAtPos;
  if (!editor.isActive(Table.name) || !node) {
    return false;
  }
  if (isTableSelected(state.selection)) {
    return true;
  }

  let container = node;

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement!;
  }
  const gripColumn =
    container && container.querySelector && container.querySelector('a.grip-column.selected');
  if (gripColumn) {
    return false;
  }
  const gripRow =
    container && container.querySelector && container.querySelector('a.grip-row.selected');
  if (gripRow) {
    return false;
  }

  // 获取选择的单元格数量
  const selection = state.selection;
  if (selection instanceof CellSelection) {
    // 如果是CellSelection，则选择了单元格
    let cellCount = 0;
    selection.forEachCell(() => {
      cellCount++;
    });
    // 返回true如果选择的单元格数量大于1
    return cellCount > 0;
  }

  return false;
};

export const isColumnGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement;
  const nodeDOM = view.nodeDOM(from) as HTMLElement;
  const node = nodeDOM || domAtPos;

  if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) {
    return false;
  }

  let container = node;

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement!;
  }

  const gripColumn =
    container && container.querySelector && container.querySelector('a.grip-column.selected');

  return !!gripColumn;
};
export const isRowGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement;
  const nodeDOM = view.nodeDOM(from) as HTMLElement;
  const node = nodeDOM || domAtPos;

  if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) {
    return false;
  }

  let container = node;

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement!;
  }

  const gripRow =
    container && container.querySelector && container.querySelector('a.grip-row.selected');

  return !!gripRow;
};
