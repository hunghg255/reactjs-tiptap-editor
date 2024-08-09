/* eslint-disable import/named */
/* eslint-disable unicorn/no-array-for-each */
import React from 'react';

import { CellSelection } from '@tiptap/pm/tables';

import TableCellMenu from '@/extensions/Table/menus/TableCell/TableCellMenu';
import TableColumnMenu from '@/extensions/Table/menus/TableColumn/TableColumnMenu';
import TableRowMenu from '@/extensions/Table/menus/TableRow/TableRowMenu';

interface IPropsTableBubbleMenu {
  editor: any;
}

const TableBubbleMenu = (props: IPropsTableBubbleMenu) => {
  function onDeleteTable() {
    props.editor.chain().focus().deleteTable().run();
  }

  function onSetCellBackground(color: string) {
    props.editor.chain().focus().setTableCellBackground(color).run();
  }

  function onMergeCell() {
    props.editor.chain().focus().mergeCells().run();
  }

  function onSplitCell() {
    const posQueue: Array<number> = [];
    (props.editor.state.selection as CellSelection).forEachCell((cell, pos) => {
      if (cell.attrs.colspan > 1 || cell.attrs.rowspan > 1) {
        posQueue.push(pos);
      }
    });
    let chain = props.editor.chain();
    posQueue
      .sort((x, y) => y - x)
      .forEach((pos) => {
        chain = chain.setCellSelection({ anchorCell: pos }).splitCell();
      });
    chain.run();
  }

  return (
    <>
      <TableCellMenu
        editor={props?.editor}
        onDeleteTable={onDeleteTable}
        onSplitCell={onSplitCell}
        onMergeCell={onMergeCell}
        onSetCellBackground={onSetCellBackground}
      />
      <TableColumnMenu
        editor={props?.editor}
        onSplitCell={onSplitCell}
        onMergeCell={onMergeCell}
        onSetCellBackground={onSetCellBackground}
      />
      <TableRowMenu
        editor={props?.editor}
        onSplitCell={onSplitCell}
        onMergeCell={onMergeCell}
        onSetCellBackground={onSetCellBackground}
      />
    </>
  );
};

export default TableBubbleMenu;
