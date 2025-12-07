import { Table as TiptapTable, TableRow, TableCell, TableHeader, type TableCellOptions, type TableRowOptions,type TableHeaderOptions  } from '@tiptap/extension-table';

import type { GeneralOptions } from '@/types';

import type { TableCellBackgroundOptions } from './TableCellBackground';
import { TableCellBackground } from './TableCellBackground';

export interface TableOptions extends GeneralOptions<TableOptions> {
  HTMLAttributes: Record<string, any>
  resizable: boolean
  handleWidth: number
  cellMinWidth: number
  lastColumnResizable: boolean
  allowTableNodeSelection: boolean
  /** options for table rows */
  tableRow: Partial<TableRowOptions>
  /** options for table headers */
  tableHeader: Partial<TableHeaderOptions>
  /** options for table cells */
  tableCell: Partial<TableCellOptions>
  /** options for table cell background */
  tableCellBackground: Partial<TableCellBackgroundOptions>
}

export * from '@/extensions/Table/components/RichTextTable';

export const Table = /* @__PURE__ */ TiptapTable.extend<TableOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        style: `
          border: 1px solid #000;
          border-collapse: collapse;
          width: 100%;
        `,
      },
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: false,

      button: ({ editor, t }: any) => ({
        componentProps: {
          isActive: () => editor.isActive('table'),
          icon: 'Table',
          tooltip: t('editor.table.tooltip'),
        },
      }),
    };
  },

  addExtensions() {
    return [
      TableRow.configure(this.options.tableRow),
      TableHeader.configure(this.options.tableHeader),
      TableCell.configure(this.options.tableCell),
      TableCellBackground.configure(this.options.tableCellBackground),
    ];
  },
});
