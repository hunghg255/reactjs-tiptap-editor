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
import { analyzeCellSelection, isColumnGripSelected } from '@/extensions/Table/utils';
import { useLocale } from '@/locales';

interface IPropsTableColumnMenu {
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

const TableColumnMenu = (props: IPropsTableColumnMenu) => {
  const { t } = useLocale();

  const shouldShow = ({ view, state, from }: ShouldShowProps) => {
    if (!state) {
      return false;
    }
    return isColumnGripSelected({
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

  function onAddColumnBefore() {
    props.editor.chain().focus().addColumnBefore().run();
  }

  function onAddColumnAfter() {
    props.editor.chain().focus().addColumnAfter().run();
  }

  function onDeleteColumn() {
    props.editor.chain().focus().deleteColumn().run();
  }

  return (
    <BubbleMenu
      editor={props?.editor}
      pluginKey='tableColumnMenu'
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
      <div className='min-w-32 flex flex-row h-full leading-none gap-0.5 p-2 bg-background rounded-lg shadow-sm border border-border'>
        <ActionButton
          icon='BetweenHorizonalEnd'
          action={onAddColumnBefore}
          tooltip={t('editor.table.insertColumnLeft')}
          tooltipOptions={{
            sideOffset: 15,
          }}
        />
        <ActionButton
          icon='BetweenHorizonalStart'
          action={onAddColumnAfter}
          tooltip={t('editor.table.insertColumnRight')}
          tooltipOptions={{
            sideOffset: 15,
          }}
        />

        <ActionButton
          icon='Trash2'
          action={onDeleteColumn}
          tooltip={t('editor.table.deleteColumn')}
          tooltipOptions={{
            sideOffset: 15,
          }}
        />
        {Selection?.cellCount! > 1 && (
          <ActionButton
            icon='TableCellsMerge'
            action={props?.onMergeCell}
            tooltip={t('editor.table.mergeCells')}
            tooltipOptions={{
              sideOffset: 15,
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
            }}
          />
        )}
        <HighlightActionButton
          editor='editor'
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

export default TableColumnMenu;
