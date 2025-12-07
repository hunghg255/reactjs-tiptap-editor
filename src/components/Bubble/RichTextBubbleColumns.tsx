import { useCallback } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';

import { ActionButton } from '@/components/ActionButton';
import { MultipleColumnNode } from '@/extensions/Column';
import { useLocale } from '@/locales';
import { deleteNode } from '@/utils/delete-node';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

export function RichTextBubbleColumns() {
  const editable = useEditableEditor();
  const editor = useEditorInstance();
  const { t } = useLocale();

  const shouldShow = useCallback(() => editor.isActive(MultipleColumnNode.name), [editor]);
  const deleteMe = useCallback(() => deleteNode(MultipleColumnNode.name, editor), [editor]);
  const addColBefore = useCallback(() => editor.chain().focus().addColBefore().run(), [editor]);
  const addColAfter = useCallback(() => editor.chain().focus().addColAfter().run(), [editor]);
  const deleteCol = useCallback(() => editor.chain().focus().deleteCol().run(), [editor]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={{ placement: 'bottom', offset: 8, flip: true }}
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
