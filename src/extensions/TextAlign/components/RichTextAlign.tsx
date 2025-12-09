import React, { useMemo } from 'react';

import { ActionButton, IconComponent } from '@/components';
import { Popover, PopoverContent, PopoverTrigger, Toggle, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { TextAlign } from '@/extensions/TextAlign/TextAlign';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKey } from '@/utils/plateform';

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

export function RichTextAlign() {
  const [open, setOpen] = React.useState(false);
  const buttonProps = useButtonProps(TextAlign.name);

  const {
    icon = undefined,
    tooltip = undefined,
    items = [],
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { disabled, dataState } = useActive(isActive);

  const currentAlign = useMemo(() => {
    return (dataState)?.title || '';
  }, [dataState]);

  const hasAlign = useMemo(() => {
    return items?.some((item: Item) => item.title === currentAlign);
  }, [items, currentAlign]);

  if (!buttonProps) {
    return <></>;
  }

  return (
    <Popover
      modal
      onOpenChange={setOpen}
    open={open}
    >
      <PopoverTrigger asChild
        className='hover:richtext-bg-accent data-[state=on]:richtext-bg-accent'
        data-state={hasAlign ? 'on' : 'off'} // active background control
        disabled={disabled}
      >
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          disabled={disabled}
          icon={icon}
          tooltip={tooltip}
          // tooltipOptions={tooltipOptions}
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
        {items?.map((item: any, index: any) => {
          return (
            <Tooltip key={`text-align-${index}`}>
              <TooltipTrigger asChild>
                <Toggle
                  className="richtext-size-7 richtext-p-1"
                  data-state={currentAlign === item.title ? 'on' : 'off'}
                  size="sm"
                  onClick={() => {
                    item?.action();
                    setOpen(false);
                  }}
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
                    {item.shortcutKeys?.map((item: any) => getShortcutKey(item)).join(' ')}
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
