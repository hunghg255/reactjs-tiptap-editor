import React from 'react';

import {
  ActionButton,
} from '@/components';

interface Props {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  action: (language: string) => void
  icon?: any
}

function CodeBlockActiveButton({ action, ...props }: Props) {

  return (
    <ActionButton
      action={action}
      disabled={props?.disabled}
      icon={props?.icon}
      tooltip={props?.tooltip}
    />
  );
}

export default CodeBlockActiveButton;
