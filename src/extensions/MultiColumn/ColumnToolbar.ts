import { Extension } from '@tiptap/core';

import ActionButton from '@/components/ActionButton';

export const ColumnToolbar = Extension.create<any>({
  name: 'columnToolbar',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: any) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            editor
              .chain()
              .setColumns()
              .focus(editor.state.selection.head - 1)
              .run();
          },
          icon: 'Columns',
          tooltip: t('editor.columns.tooltip'),
        },
      }),
    };
  },
});
