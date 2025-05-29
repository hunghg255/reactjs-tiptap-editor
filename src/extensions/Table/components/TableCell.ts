import { TableCell as TBCell } from '@tiptap/extension-table-cell';

export const TableCell = TBCell.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        style: `
            border-right: 1px solid #000; 
            padding: 8px 12px;            
            &:last-child {
              border-right: none;        
            }
          `,
      },
    };
  },
});
