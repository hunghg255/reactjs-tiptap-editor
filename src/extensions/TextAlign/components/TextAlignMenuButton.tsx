/* eslint-disable unicorn/prefer-logical-operator-over-ternary */
import React, { useMemo } from 'react';

import ActionButton from '@/components/ActionButton';
import Icon from '@/components/icons/Icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKey } from '@/utils/plateform';

interface IPropsTextAlignMenuButton {}

export interface Item {
  title: string;
  icon?: any;
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>;
  action?: ButtonViewReturnComponentProps['action'];
  style?: React.CSSProperties;
  shortcutKeys?: string[];
  disabled?: boolean;
  divider?: boolean;
  default?: boolean;
}
interface IPropsTextAlignMenuButton {
  editor: any;
  disabled?: boolean;
  color?: string;
  maxHeight?: string | number;
  icon?: any;
  tooltip?: string;
  items?: Item[];
}

const TextAlignMenuButton = (props: IPropsTextAlignMenuButton) => {
  const active = useMemo(() => {
    const find: any = props?.items?.find((k: any) => k.isActive());
    if (find && !find.default) {
      return {
        ...find,
        icon: find.icon ? find.icon : props.icon,
      };
    }
    const item: Item = {
      title: props?.tooltip as any,
      icon: props.icon,
      isActive: () => false,
    };

    return item;
  }, [props]);

  return (
    <Popover>
      <PopoverTrigger disabled={props?.disabled}>
        <div className='flex'>
          <ActionButton
            customClass='w-12'
            enable-tooltip
            icon={props?.icon}
            tooltip={props?.tooltip}
            disabled={props?.disabled}
          >
            <Icon className='w-3 h-3 ml-1 text-zinc-500' name='MenuDown' />
          </ActionButton>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className='min-w-4 w-full !p-[4px] flex flex-row gap-1'
        align='start'
        side='bottom'
      >
        {props?.items?.map((item, index) => {
          return (
            <Tooltip key={`text-align-${index}`}>
              <TooltipTrigger>
                <Toggle
                  size='sm'
                  onClick={item?.action}
                  className='w-7 h-7 p-1'
                  pressed={active.title === item.title}
                  data-state={active.title === item.title ? 'on' : 'off'}
                >
                  {item?.icon && <Icon name={item.icon} />}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent className='flex flex-col items-center'>
                <span>{item.title}</span>
                {!!item.shortcutKeys?.length && (
                  <span>{item.shortcutKeys?.map((item) => getShortcutKey(item)).join(' ')}</span>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default TextAlignMenuButton;
