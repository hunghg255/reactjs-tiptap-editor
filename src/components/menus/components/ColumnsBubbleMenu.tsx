import { useCallback } from 'react';

import { BubbleMenu } from '@tiptap/react';

import { ActionButton } from '@/components/ActionButton';
import { MultiColumn } from '@/extensions/MultiColumn';
import { useLocale } from '@/locales';
import { deleteNode } from '@/utils/delete-node';

export function ColumnsBubbleMenu({ editor }: any) {
  const { t } = useLocale();

  const shouldShow = useCallback(() => editor.isActive(MultiColumn.name), [editor]);
  const deleteMe = useCallback(() => deleteNode(MultiColumn.name, editor), [editor]);
  const addColBefore = useCallback(() => editor.chain().focus().addColBefore().run(), [editor]);
  const addColAfter = useCallback(() => editor.chain().focus().addColAfter().run(), [editor]);
  const deleteCol = useCallback(() => editor.chain().focus().deleteCol().run(), [editor]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="columns-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        placement: 'bottom-start',
        offset: [-2, 16],
        zIndex: 9999,
        // onHidden: () => {
        //   toggleVisible(false)
        // },
      }}
    >
      <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
        <ActionButton
          action={addColBefore}
          icon="ColumnAddLeft"
          tooltip={t('editor.table.menu.insertColumnBefore')}
        />

        <ActionButton
          action={addColAfter}
          icon="ColumnAddRight"
          tooltip={t('editor.table.menu.insertColumnAfter')}
        />

        <ActionButton
          action={deleteCol}
          icon="DeleteColumn"
          tooltip={t('editor.table.menu.deleteColumn')}
        />

        <ActionButton
          action={deleteMe}
          icon="Trash2"
          tooltip={t('editor.table.menu.delete_column')}
        />
      </div>
    </BubbleMenu>
  );
}
