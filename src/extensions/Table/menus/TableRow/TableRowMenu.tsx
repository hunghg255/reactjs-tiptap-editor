/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable unicorn/no-null */
import React, { useMemo } from 'react';

import { Editor as CoreEditor } from '@tiptap/core';
import { EditorState, NodeSelection } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';
import { EditorView } from '@tiptap/pm/view';
import { BubbleMenu } from '@tiptap/react';

import ActionButton from '@/components/ActionButton';
import HighlightActionButton from '@/extensions/Highlight/components/HighlightActionButton';
import { analyzeCellSelection, isRowGripSelected } from '@/extensions/Table/utils';
import { useLocale } from '@/locales';

interface IPropsTableRowMenu {
  editor: any;
  onSplitCell: () => void;
  onMergeCell: () => void;
  onSetCellBackground: (color: string) => void;
}

export interface ShouldShowProps {
  editor?: CoreEditor;
  view: EditorView;
  state?: EditorState;
  oldState?: EditorState;
  from?: number;
  to?: number;
}

const TableRowMenu = (props: IPropsTableRowMenu) => {
  const { t } = useLocale();

  const shouldShow = ({ view, state, from }: ShouldShowProps) => {
    if (!state) {
      return false;
    }

    return isRowGripSelected({
      editor: props.editor,
      view,
      state,
      from: from || 0,
    });
  };

  const Selection = useMemo(() => {
    const NodeSelection = props.editor.state.selection as NodeSelection;
    const isCell = NodeSelection instanceof CellSelection;
    return isCell ? analyzeCellSelection(props.editor) : null;
  }, [props]);

  function onAddRowBefore() {
    props.editor.chain().focus().addRowBefore().run();
  }

  function onAddRowAfter() {
    props.editor.chain().focus().addRowAfter().run();
  }

  function onDeleteRow() {
    props.editor.chain().focus().deleteRow().run();
  }

  return (
    <BubbleMenu
      editor={props?.editor}
      pluginKey='tableRowMenu'
      updateDelay={0}
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: 'parent',
        placement: 'left',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
    >
      <div className='flex flex-col h-full leading-none gap-0.5 p-2 bg-background rounded-lg shadow-sm border border-border'>
        <ActionButton
          icon='BetweenVerticalEnd'
          action={onAddRowBefore}
          tooltip={t('editor.table.insertRowAbove')}
          tooltipOptions={{
            sideOffset: 15,
            side: 'right',
          }}
        />

        <ActionButton
          icon='BetweenVerticalStart'
          action={onAddRowAfter}
          tooltip={t('editor.table.insertRowBelow')}
          tooltipOptions={{
            sideOffset: 15,
            side: 'right',
          }}
        />
        <ActionButton
          icon='Trash2'
          action={onDeleteRow}
          tooltip={t('editor.table.deleteRow')}
          tooltipOptions={{
            sideOffset: 15,
            side: 'right',
          }}
        />
        {Selection?.cellCount! > 1 && (
          <ActionButton
            icon='TableCellsMerge'
            action={props?.onMergeCell}
            tooltip={t('editor.table.mergeCells')}
            tooltipOptions={{
              sideOffset: 15,
              side: 'right',
            }}
          />
        )}
        {Selection?.mergedCellCount! > 0 && (
          <ActionButton
            icon='TableCellsSplit'
            action={props?.onSplitCell}
            tooltip={t('editor.table.splitCells')}
            tooltipOptions={{
              sideOffset: 15,
              side: 'right',
            }}
          />
        )}

        <HighlightActionButton
          editor={props?.editor}
          tooltip={t('editor.table.setCellsBgColor')}
          action={(color) => props?.onSetCellBackground(color as string)}
          tooltipOptions={{
            sideOffset: 15,
            side: 'right',
          }}
        />
      </div>
    </BubbleMenu>
  );
};

export default TableRowMenu;
