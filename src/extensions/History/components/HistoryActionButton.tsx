/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
import React from 'react';

import { TooltipContentProps } from '@radix-ui/react-tooltip';

import icons from '@/components/icons/icons';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';

interface IPropsHistoryActionButton {
  icon?: string;
  title?: string;
  tooltip?: string;
  disabled?: boolean;
  shortcutKeys?: string[];
  customClass?: string;
  loading?: boolean;
  tooltipOptions?: TooltipContentProps;
  color?: string;
  action?: ButtonViewReturnComponentProps['action'];
  isActive?: ButtonViewReturnComponentProps['isActive'];
  children?: React.ReactNode;
}

const HistoryActionButton = (props?: Partial<IPropsHistoryActionButton>) => {
  const {
    icon = undefined,
    title = undefined,
    tooltip = undefined,
    disabled = false,
    customClass = '',
    color = undefined,
    loading = false,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
    children,
  } = props as any;

  const Icon = icons[icon as string];

  return (
    <Tooltip>
      <TooltipTrigger>
        <Toggle
          size='sm'
          className={'w-[32px] h-[32px] ' + customClass}
          disabled={isActive?.()}
          onClick={action}
          // data-state={isActive?.() ? 'on' : 'off'}
        >
          {Icon && <Icon className='w-4 h-4' />}
          {children && <>{children}</>}
        </Toggle>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent {...tooltipOptions}>
          <div className='max-w-24 text-center flex flex-col items-center'>
            <div>{tooltip}</div>
            {!!props?.shortcutKeys?.length && <span>{getShortcutKeys(props?.shortcutKeys)}</span>}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default HistoryActionButton;
