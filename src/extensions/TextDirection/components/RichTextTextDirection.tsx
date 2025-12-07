import React, { useMemo } from 'react';

import { ActionButton, IconComponent } from '@/components';
import { Popover, PopoverContent, PopoverTrigger, Toggle, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKey } from '@/utils/plateform';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { TextDirection } from '@/extensions/TextDirection/TextDirection';

export interface Item {
  title: string
  value?: string
  icon?: any
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}

export function RichTextTextDirection() {
 const buttonProps = useButtonProps(TextDirection.name);
 const [open, setOpen] = React.useState(false);

  const {
    icon = undefined,
    tooltip = undefined,
    items = [],
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled, dataState } = useActive(isActive);

  const currentDir = useMemo(() => {
    return (dataState)?.dir || 'unset';
  }, [dataState]);

  if (!buttonProps) {
    return <></>;
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    modal>
      <PopoverTrigger asChild
        disabled={editorDisabled}
      >
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          disabled={editorDisabled}
          icon={icon}
          tooltip={tooltip}
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
        hideWhenDetached
      >
        {items?.map((item: any, index: any) => {
          return (
            <Tooltip key={`text-direction-${index}`}>
              <TooltipTrigger
                data-state={currentDir === item.value ? 'on' : 'off'}
                asChild>
                <Toggle
                  className="richtext-size-7 richtext-p-1"
                  onClick={() => {
                    item?.action();
                    setOpen(false);
                  }}
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
