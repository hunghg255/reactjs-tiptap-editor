/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable unicorn/no-null */
/* eslint-disable import/named */
import React, { useMemo } from 'react';

import { Editor as CoreEditor } from '@tiptap/core';
import { EditorState, NodeSelection } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';
import { EditorView } from '@tiptap/pm/view';
import { BubbleMenu } from '@tiptap/react';

import ActionButton from '@/components/ActionButton';
import HighlightActionButton from '@/extensions/Highlight/components/HighlightActionButton';
import {
  analyzeCellSelection,
  isTableCellSelected,
  isTableSelected,
} from '@/extensions/Table/utils';
import { useLocale } from '@/locales';

interface IPropsTableCellMenu {
  editor: any;
  onDeleteTable: () => void;
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

const TableCellMenu = (props: IPropsTableCellMenu) => {
  const { t } = useLocale();

  const shouldShow = ({ view, state, from }: ShouldShowProps) => {
    if (!state) {
      return false;
    }
    return isTableCellSelected({
      editor: props.editor,
      view,
      state,
      from: from || 0,
    });
  };

  const Selection: any = useMemo(() => {
    const NodeSelection = props.editor.state.selection as NodeSelection;
    const isCell = NodeSelection instanceof CellSelection;
    if (isCell) {
      return analyzeCellSelection(props.editor);
    }
    return null;
  }, [props]);

  return (
    <BubbleMenu
      editor={props.editor}
      pluginKey='tableCellMenu'
      updateDelay={0}
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: 'parent',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
    >
      <div className='flex flex-row h-full leading-none gap-0.5 p-2 bg-background rounded-lg shadow-sm border border-border'>
        {Selection?.cellCount! > 1 && (
          <ActionButton
            tooltip={t('editor.table.mergeCells')}
            icon='TableCellsMerge'
            action={props?.onMergeCell}
            tooltip-options={{
              sideOffset: 15,
            }}
          />
        )}

        {Selection?.mergedCellCount! > 0 && (
          <ActionButton
            tooltip={t('editor.table.splitCells')}
            icon='TableCellsSplit'
            action={props?.onSplitCell}
            tooltipOptions={{
              sideOffset: 15,
            }}
          />
        )}
        {isTableSelected(props.editor.state.selection) && (
          <ActionButton
            tooltip={t('editor.table.delete')}
            icon='Trash2'
            action={props?.onDeleteTable}
            tooltipOptions={{
              sideOffset: 15,
            }}
          />
        )}

        <HighlightActionButton
          editor={props?.editor}
          tooltip={t('editor.table.setCellsBgColor')}
          action={(color) => props?.onSetCellBackground(color as string)}
          tooltipOptions={{
            sideOffset: 15,
          }}
        />
      </div>
    </BubbleMenu>
  );
};

export default TableCellMenu;
