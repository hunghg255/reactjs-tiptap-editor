import React, { useMemo } from 'react';

import {
  ActionButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconComponent,
  MenuDown,
} from '@/components';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';

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
interface IPropsActionMoreButton {
  editor: any
  disabled?: boolean
  color?: string
  maxHeight?: string | number
  icon?: any
  tooltip?: string
  items?: Item[]
}

function ActionMoreButton(props: IPropsActionMoreButton) {
  const active = useMemo(() => {
    const find: any = props?.items?.find((k: any) => k.isActive());
    if (find && !find.default) {
      return {
        ...find,
        icon: find?.icon ? find?.icon : props?.icon,
      };
    }
    const item: Item = {
      title: props.tooltip as any,
      icon: props.icon,
      isActive: () => false,
    };

    return item;
  }, [props]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild
        disabled={props?.disabled}
      >
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          disabled={props?.disabled}
          icon={props?.icon}
          tooltip={props?.tooltip}
        >
          <MenuDown className="richtext-size-3 richtext-text-gray-500" />
        </ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full">
        {props?.items?.map((item: any, index) => {
          return (
            <DropdownMenuCheckboxItem
              checked={active.title === item.title}
              className="richtext-flex richtext-items-center richtext-gap-3"
              key={`more-mark-${index}`}
              onClick={item.action}
            >
              <IconComponent name={item?.icon} />

              <span className="richtext-ml-1">
                {item.title}
              </span>

              {!!item?.shortcutKeys && (
                <span className="richtext-ml-auto richtext-text-xs richtext-tracking-widest richtext-opacity-60">
                  {getShortcutKeys(item.shortcutKeys)}
                </span>
              )}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ActionMoreButton;
