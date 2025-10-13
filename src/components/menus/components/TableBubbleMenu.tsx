import type { Editor } from '@tiptap/core';
import { isActive } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/react';
import type { GetReferenceClientRect } from 'tippy.js';
import { sticky } from 'tippy.js';

import { ActionButton, type ActionButtonProps, Separator } from '@/components';
import HighlightActionButton from '@/extensions/Highlight/components/HighlightActionButton';
import { useLocale } from '@/locales';

export interface TableBubbleMenuProps {
  editor: Editor
  disabled?: boolean
  actions?: ActionButtonProps[]
  hiddenActions?: string[]
}

function TableBubbleMenu({ editor, disabled, actions, hiddenActions = [] }: TableBubbleMenuProps) {
  const shouldShow = ({ editor }: { editor: Editor }) => {
    return isActive(editor.view.state, 'table');
  };
  const { t } = useLocale();

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

  function onSetCellBackground(color: string) {
    editor.chain().focus().setTableCellBackground(color).run();
  }
  const getReferenceClientRect: GetReferenceClientRect = () => {
    const {
      view,
      state: {
        selection: { from },
      },
    } = editor;

    const node = view.domAtPos(from).node as HTMLElement;
    if (!node) {
      return new DOMRect(-1000, -1000, 0, 0);
    }

    const tableWrapper = node?.closest?.('.tableWrapper');
    if (!tableWrapper) {
      return new DOMRect(-1000, -1000, 0, 0);
    }

    const rect = tableWrapper.getBoundingClientRect();

    return rect;
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="table"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        maxWidth: 'auto',
        getReferenceClientRect,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      {
        disabled
          ? <></>
          : (
            <div className="richtext-flex richtext-size-full richtext-min-w-32 richtext-flex-row richtext-items-center richtext-gap-0.5 richtext-rounded-lg !richtext-border richtext-border-border richtext-bg-background richtext-p-2 richtext-leading-none richtext-shadow-sm">

              {!isHidden('addColumnBefore') && (
                <ActionButton
                  action={onAddColumnBefore}
                  disabled={!editor?.can()?.addColumnBefore?.()}
                  icon="BetweenHorizonalEnd"
                  tooltip={t('editor.table.menu.insertColumnBefore')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              {!isHidden('addColumnAfter') && (
                <ActionButton
                  action={onAddColumnAfter}
                  disabled={!editor?.can()?.addColumnAfter?.()}
                  icon="BetweenHorizonalStart"
                  tooltip={t('editor.table.menu.insertColumnAfter')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              {!isHidden('deleteColumn') && (
                <ActionButton
                  action={onDeleteColumn}
                  disabled={!editor?.can().deleteColumn?.()}
                  icon="DeleteColumn"
                  tooltip={t('editor.table.menu.deleteColumn')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]" orientation="vertical" />

              {!isHidden('addRowAbove') && (
                <ActionButton
                  action={onAddRowAbove}
                  disabled={!editor?.can().addRowBefore?.()}
                  icon="BetweenVerticalEnd"
                  tooltip={t('editor.table.menu.insertRowAbove')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              {!isHidden('addRowBelow') && (
                <ActionButton
                  action={onAddRowBelow}
                  disabled={!editor?.can()?.addRowAfter?.()}
                  icon="BetweenVerticalStart"
                  tooltip={t('editor.table.menu.insertRowBelow')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              {!isHidden('deleteRow') && (
                <ActionButton
                  action={onDeleteRow}
                  disabled={!editor?.can()?.deleteRow?.()}
                  icon="DeleteRow"
                  tooltip={t('editor.table.menu.deleteRow')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]" orientation="vertical" />

              {!isHidden('mergeCells') && (
                <ActionButton
                  action={onMergeCell}
                  disabled={!editor?.can()?.mergeCells?.()}
                  icon="TableCellsMerge"
                  tooltip={t('editor.table.menu.mergeCells')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              {!isHidden('splitCells') && (
                <ActionButton
                  action={onSplitCell}
                  disabled={!editor?.can()?.splitCell?.()}
                  icon="TableCellsSplit"
                  tooltip={t('editor.table.menu.splitCells')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]" orientation="vertical" />

              {!isHidden('setCellBackground') && (
                <HighlightActionButton
                  action={onSetCellBackground}
                  editor={editor}
                  tooltip={t('editor.table.menu.setCellsBgColor')}
                  tooltipOptions={{ sideOffset: 15 }}
                />
              )}

              {!isHidden('deleteTable') && (
                <ActionButton
                  action={onDeleteTable}
                  disabled={!editor?.can()?.deleteTable?.()}
                  icon="Trash2"
                  tooltip={t('editor.table.menu.deleteTable')}
                  tooltip-options={{ sideOffset: 15 }}
                />
              )}

              {actions && actions.map((item, i) => (
                <ActionButton key={i}
                  {...item}
                />
              ))}
            </div>
          )
      }

    </BubbleMenu>
  );
}

export { TableBubbleMenu };
