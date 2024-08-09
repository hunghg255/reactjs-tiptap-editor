/* eslint-disable unicorn/consistent-function-scoping */
import React from 'react';

import { BubbleMenu, isActive } from '@tiptap/react';
import { sticky } from 'tippy.js';

import ActionButton from '@/components/ActionButton';
import { ColumnLayout } from '@/extensions/MultiColumn/Columns';
import getRenderContainer from '@/utils/getRenderContainer';

interface IPropsColumnsMenu {
  editor: any;
  disabled?: boolean;
}

const shouldShow = ({ editor }: any) => {
  return isActive(editor.view.state, 'columns');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ColumnsMenu = (props: IPropsColumnsMenu) => {
  const getReferenceClientRect = () => {
    const renderContainer = getRenderContainer(props.editor, 'columns');
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);

    return rect;
  };

  const onColumnLeft = () => {
    props.editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run();
  };

  const onColumnRight = () => {
    props.editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run();
  };

  const onColumnTwo = () => {
    props.editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run();
  };

  return (
    <BubbleMenu
      editor={props?.editor}
      pluginKey='columns'
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <div className='p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800'>
        <div className='flex gap-1 items-center'>
          <ActionButton
            title='ok'
            icon='PanelLeft'
            tooltip='Left Sidebar'
            action={onColumnLeft}
            isActive={() => props?.editor.isActive('columns', { layout: ColumnLayout.SidebarLeft })}
            tooltipOptions={{ sideOffset: 15 }}
          />
          <ActionButton
            title='ok'
            icon='Columns'
            tooltip='Two-column layout'
            action={onColumnTwo}
            isActive={() => props?.editor.isActive('columns', { layout: ColumnLayout.TwoColumn })}
            tooltipOptions={{ sideOffset: 15 }}
          />
          <ActionButton
            title='ok'
            icon='PanelRight'
            tooltip='Right Sidebar'
            action={onColumnRight}
            isActive={() =>
              props?.editor.isActive('columns', { layout: ColumnLayout.SidebarRight })
            }
            tooltipOptions={{ sideOffset: 15 }}
          />
        </div>
      </div>
    </BubbleMenu>
  );
};

export default ColumnsMenu;
