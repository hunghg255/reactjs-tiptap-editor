import React from 'react';

import { ActionButton } from '@/components';
import CreateTablePopover from '@/extensions/Table/components/CreateTablePopover';
import { Table } from '@/extensions/Table/Table';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useEditorInstance } from '@/store/editor';

export function RichTextTable() {
  const editor = useEditorInstance();
 const buttonProps = useButtonProps(Table.name);

  const {
    icon = undefined,
    tooltip = undefined,
    action = undefined,
    isActive = undefined,
    color
  } = buttonProps?.componentProps ?? {};

  const { dataState, disabled } = useToggleActive(isActive);

  if (!buttonProps) {
    return <></>;
  }

  function createTable(options: any) {
    editor
      .chain()
      .focus()
      .insertTable({ ...options, withHeaderRow: false })
      .run();
  }

  return (
    <CreateTablePopover createTable={createTable}
    dataState={dataState}
    >
      <ActionButton
        action={action}
        color={color}
        dataState={dataState}
        icon={icon}
        isActive={isActive}
        tooltip={tooltip}
        // tooltipOptions={tooltipOptions}
        disabled={disabled}
      />
    </CreateTablePopover>
  );
}
