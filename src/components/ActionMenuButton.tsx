import React from 'react';

import { Slot } from '@radix-ui/react-slot';

import icons from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';

interface IPropsActionMenuButton {
  icon?: any;
  title?: string;
  tooltip?: string;
  disabled?: boolean;
  shortcutKeys?: string[];
  color?: string;
  action?: ButtonViewReturnComponentProps['action'];
  isActive?: ButtonViewReturnComponentProps['isActive'];
  asChild?: boolean;
}

const ActionMenuButton = React.forwardRef<HTMLButtonElement, IPropsActionMenuButton>(
  ({ asChild, ...props }, ref) => {
    const Icon = icons[props.icon];
    const Comp = asChild ? Slot : Button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={ref}
            className='h-[32px] px-[5px] py-0 min-w-24 max-w-32 overflow-hidden'
            variant='ghost'
            disabled={props?.disabled}
            {...props}
          >
            <div className='flex items-center h-full font-normal'>
              {props?.title && (
                <div className='flex-grow text-sm text-left truncate'>{props?.title}</div>
              )}
              {Icon && <Icon className='flex-shrink-0 w-3 h-3 ml-1 text-zinc-500' />}
            </div>
          </Comp>
        </TooltipTrigger>
        <TooltipContent>
          <div className='flex flex-col items-center text-center max-w-24'>
            {props?.tooltip && <div>{props?.tooltip}</div>}
            <div className='flex'>
              {!!props?.shortcutKeys?.length && <span>{getShortcutKeys(props?.shortcutKeys)}</span>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  },
);

ActionMenuButton.displayName = 'ActionMenuButton';

export default ActionMenuButton;
