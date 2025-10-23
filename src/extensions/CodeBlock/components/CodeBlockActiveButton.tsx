import React from 'react';

import {
  ActionButton,
} from '@/components';

import type { TooltipContentProps } from '@radix-ui/react-tooltip';

interface Props {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  tooltipOptions?: TooltipContentProps
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
      tooltipOptions={props?.tooltipOptions}
    />
  );
}

export default CodeBlockActiveButton;
