import React from 'react';

import { ActionButton } from '@/components';
import CreateTablePopover from '@/extensions/Table/components/CreateTablePopover';
import type { ButtonViewReturnComponentProps } from '@/types';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

interface IPropsTableActionButton {
  editor: any
  icon?: any
  tooltip?: string
  tooltipOptions?: TooltipContentProps
  disabled?: boolean
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

function TableActionButton(props: IPropsTableActionButton) {
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
    <CreateTablePopover createTable={createTable}>
      <ActionButton
        icon={props?.icon}
        tooltip={props?.tooltip}
        tooltipOptions={props?.tooltipOptions}
        disabled={props?.disabled}
        color={props?.color}
        action={props?.action}
        isActive={props?.isActive}
      />
    </CreateTablePopover>
  );
}

export default TableActionButton;
