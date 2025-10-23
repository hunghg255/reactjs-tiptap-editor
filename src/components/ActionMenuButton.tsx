/* eslint-disable react/display-name */
import React from 'react';

import { Slot } from '@radix-ui/react-slot';

import { Button, Tooltip, TooltipContent, TooltipTrigger, icons } from '@/components';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export interface ActionMenuButtonProps {
  /** Icon name to display */
  icon?: any
  /** Button title text */
  title?: string
  /** Tooltip text */
  tooltip?: string
  /** Tooltip options */
  tooltipOptions?: TooltipContentProps    
  /** Whether the button is disabled */
  disabled?: boolean
  /** Keyboard shortcut keys */
  shortcutKeys?: string[]
  /** Button color */
  color?: string
  /** Click action handler */
  action?: ButtonViewReturnComponentProps['action']
  /** Active state checker */
  isActive?: ButtonViewReturnComponentProps['isActive']
  /** Whether to render as child */
  asChild?: boolean
}

const ActionMenuButton = React.forwardRef<HTMLButtonElement, ActionMenuButtonProps>(
  ({ asChild, ...props }, ref) => {
    const Icon = icons[props.icon];
    const Comp = asChild ? Slot : Button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            className="richtext-h-[32px] richtext-min-w-24 richtext-overflow-hidden richtext-px-[5px]  richtext-py-0"
            disabled={props?.disabled}
            ref={ref}
            variant="ghost"
            {...props}
          >
            <div className="richtext-flex richtext-h-full richtext-items-center richtext-font-normal">
              {props?.title && (
                <div className="richtext-grow richtext-truncate richtext-text-left richtext-text-sm">
                  {props?.title}
                </div>
              )}

              {Icon && <Icon className="richtext-ml-1 richtext-size-3 richtext-shrink-0 richtext-text-zinc-500" />}
            </div>
          </Comp>
        </TooltipTrigger>

        <TooltipContent {...props.tooltipOptions}>
          <div className="richtext-flex richtext-max-w-24 richtext-flex-col richtext-items-center richtext-text-center">
            {props?.tooltip && <div>
              {props?.tooltip}
            </div>}

            <div className="richtext-flex">
              {!!props?.shortcutKeys?.length && <span>
                {getShortcutKeys(props?.shortcutKeys)}
              </span>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  },
);

export { ActionMenuButton };
