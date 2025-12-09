import type { Editor } from '@tiptap/core';
import { isActive } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/react/menus';

import { ActionButton, Separator } from '@/components';
import { Table } from '@/extensions/Table';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

interface RichTextBubbleTableProps {
  hiddenActions?: string[]
}

function RichTextBubbleTable({ hiddenActions = [] }: RichTextBubbleTableProps) {
  const { t } = useLocale();

  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const shouldShow = ({ editor }: { editor: Editor }) => {
    return isActive(editor.view.state, Table.name);
  };

  const isHidden = (key: string) => hiddenActions.includes(key);

  function onAddColumnBefore() {
    editor.chain().focus().addColumnBefore().run();
  }

  function onAddColumnAfter() {
    editor.chain().focus().addColumnAfter().run();
  }

  function onDeleteColumn() {
    editor.chain().focus().deleteColumn().run();
  }
  function onAddRowAbove() {
    editor.chain().focus().addRowBefore().run();
  }

  function onAddRowBelow() {
    editor.chain().focus().addRowAfter().run();
  }

  function onDeleteRow() {
    editor.chain().focus().deleteRow().run();
  }

  function onMergeCell() {
    editor.chain().focus().mergeCells().run();
  }
  function onSplitCell() {
    editor?.chain().focus().splitCell().run();
  }
  function onDeleteTable() {
    editor.chain().focus().deleteTable().run();
  }

  // function onSetCellBackground(color: string) {
  //   editor.chain().focus().setTableCellBackground(color).run();
  // }

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      shouldShow={shouldShow}
      updateDelay={0}
    >
      <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">

        {!isHidden('addColumnBefore') && (
          <ActionButton
            action={onAddColumnBefore}
            disabled={!editor?.can()?.addColumnBefore?.()}
            icon="BetweenHorizonalEnd"
            tooltip={t('editor.table.menu.insertColumnBefore')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden('addColumnAfter') && (
          <ActionButton
            action={onAddColumnAfter}
            disabled={!editor?.can()?.addColumnAfter?.()}
            icon="BetweenHorizonalStart"
            tooltip={t('editor.table.menu.insertColumnAfter')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden('deleteColumn') && (
          <ActionButton
            action={onDeleteColumn}
            disabled={!editor?.can().deleteColumn?.()}
            icon="DeleteColumn"
            tooltip={t('editor.table.menu.deleteColumn')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
          orientation="vertical"
        />

        {!isHidden('addRowAbove') && (
          <ActionButton
            action={onAddRowAbove}
            disabled={!editor?.can().addRowBefore?.()}
            icon="BetweenVerticalEnd"
            tooltip={t('editor.table.menu.insertRowAbove')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden('addRowBelow') && (
          <ActionButton
            action={onAddRowBelow}
            disabled={!editor?.can()?.addRowAfter?.()}
            icon="BetweenVerticalStart"
            tooltip={t('editor.table.menu.insertRowBelow')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden('deleteRow') && (
          <ActionButton
            action={onDeleteRow}
            disabled={!editor?.can()?.deleteRow?.()}
            icon="DeleteRow"
            tooltip={t('editor.table.menu.deleteRow')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
          orientation="vertical"
        />

        {!isHidden('mergeCells') && (
          <ActionButton
            action={onMergeCell}
            disabled={!editor?.can()?.mergeCells?.()}
            icon="TableCellsMerge"
            tooltip={t('editor.table.menu.mergeCells')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden('splitCells') && (
          <ActionButton
            action={onSplitCell}
            disabled={!editor?.can()?.splitCell?.()}
            icon="TableCellsSplit"
            tooltip={t('editor.table.menu.splitCells')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
          orientation="vertical"
        />

        {/* {!isHidden('setCellBackground') && (
          <HighlightActionButton
            action={onSetCellBackground}
            editor={editor}
            tooltip={t('editor.table.menu.setCellsBgColor')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}  */}

        {!isHidden('deleteTable') && (
          <ActionButton
            action={onDeleteTable}
            disabled={!editor?.can()?.deleteTable?.()}
            icon="Trash2"
            tooltip={t('editor.table.menu.deleteTable')}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}
      </div>
    </BubbleMenu>
  );
}

export { RichTextBubbleTable };
