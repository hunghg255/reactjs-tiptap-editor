import React from 'react';

import ActionButton from '@/components/ActionButton';
import CreateTablePopover from '@/extensions/Table/components/CreateTablePopover';
import { ButtonViewReturnComponentProps } from '@/types';

interface IPropsTableActionButton {
  editor: any;
  icon?: any;
  tooltip?: string;
  disabled?: boolean;
  color?: string;
  action?: ButtonViewReturnComponentProps['action'];
  isActive?: ButtonViewReturnComponentProps['isActive'];
}

const TableActionButton = (props: IPropsTableActionButton) => {
  function createTable(options: any) {
    if (!props.disabled) {
      props.editor
        .chain()
        .focus()
        .insertTable({ ...options, withHeaderRow: false })
        .run();
    }
  }

  return (
    <CreateTablePopover createTable={createTable} disabled={props?.disabled}>
      <div className='flex'>
        <ActionButton
          icon={props?.icon}
          tooltip={props?.tooltip}
          disabled={props?.disabled}
          color={props?.color}
          action={props?.action}
          isActive={props?.isActive}
        ></ActionButton>
      </div>
    </CreateTablePopover>
  );
};

export default TableActionButton;
