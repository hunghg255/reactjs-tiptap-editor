import { Node } from '@tiptap/core'

import { Column } from './Column'
import type { GeneralOptions } from '@/types'

export enum ColumnLayout {
  SidebarLeft = 'sidebar-left',
  SidebarRight = 'sidebar-right',
  TwoColumn = 'two-column',
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType
      setLayout: (layout: ColumnLayout) => ReturnType
    }
  }
}
export interface ColumnsOptions extends GeneralOptions<ColumnsOptions> {
  columnOptions: any
  layout: ColumnLayout
}

export const MultiColumn = Node.create<ColumnsOptions>({
  name: 'columns',
  group: 'columns',
  content: 'column+',
  defining: true,
  isolating: true,
  addOptions() {
    return {
      ...this.parent?.(),
      layout: ColumnLayout.TwoColumn,
    }
  },

  addAttributes() {
    return {
      layout: {
        default: ColumnLayout.TwoColumn,
      },
    }
  },
  addCommands() {
    return {
      setColumns:
        () =>
          ({ commands }) => {
            commands.insertContent(
              '<div data-type="columns"><div data-type="column" data-position="left"><p></p></div><div data-type="column" data-position="right"><p></p></div></div>',
            )
            return true
          },

      setLayout:
        (layout: ColumnLayout) =>
          ({ commands }) =>
            commands.updateAttributes('columns', { layout }),
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'columns', 'class': `layout-${HTMLAttributes.layout}` }, 0]
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ]
  },
  addExtensions() {
    return [Column.configure(this.options.columnOptions)]
  },
})

export default MultiColumn
