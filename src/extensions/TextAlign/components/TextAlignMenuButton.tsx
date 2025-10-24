import React, { useMemo } from 'react';

import { ActionButton, IconComponent } from '@/components';
import { Popover, PopoverContent, PopoverTrigger, Toggle, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKey } from '@/utils/plateform';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export interface Item {
  title: string
  icon?: any
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
interface IPropsTextAlignMenuButton {
  editor: any
  disabled?: boolean
  color?: string
  maxHeight?: string | number
  icon?: any
  tooltip?: string
  tooltipOptions?: TooltipContentProps
  items?: Item[]
}

function TextAlignMenuButton(props: IPropsTextAlignMenuButton) {
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
    <Popover modal>
      <PopoverTrigger asChild
        disabled={props?.disabled}
      >
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          disabled={props?.disabled}
          icon={props?.icon}
          tooltip={props?.tooltip}
          tooltipOptions={props?.tooltipOptions}
        >
          <IconComponent className="richtext-ml-1 richtext-size-3 richtext-text-zinc-500"
            name="MenuDown"
          />
        </ActionButton>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="richtext-flex richtext-w-full richtext-min-w-4 richtext-flex-row richtext-gap-1 !richtext-p-[4px]"
        side="bottom"
      >
        {props?.items?.map((item, index) => {
          return (
            <Tooltip key={`text-align-${index}`}>
              <TooltipTrigger asChild>
                <Toggle
                  className="richtext-size-7 richtext-p-1"
                  data-state={active.title === item.title ? 'on' : 'off'}
                  onClick={item?.action}
                  pressed={active.title === item.title}
                  size="sm"
                >
                  {item?.icon && <IconComponent name={item.icon} />}
                </Toggle>
              </TooltipTrigger>

              <TooltipContent className="richtext-flex richtext-flex-col richtext-items-center">
                <span>
                  {item.title}
                </span>

                {!!item.shortcutKeys?.length && (
                  <span>
                    {item.shortcutKeys?.map(item => getShortcutKey(item)).join(' ')}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default TextAlignMenuButton;
