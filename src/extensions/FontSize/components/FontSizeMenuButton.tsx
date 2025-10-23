import React, { useMemo } from 'react';

import {
  ActionMenuButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components';
import { useLocale } from '@/locales';
import type { ButtonViewReturnComponentProps } from '@/types';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export interface Item {
  title: string
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  disabled?: boolean
  divider?: boolean
  default?: boolean
}

interface IPropsFontSizeMenuButton {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  tooltipOptions?: TooltipContentProps
  items?: Item[]
}

function FontSizeMenuButton(props: IPropsFontSizeMenuButton) {
  const { t } = useLocale();

  const active = useMemo(() => {
    const find: any = (props.items || []).find((k: any) => k.isActive());
    if (find) {
      return find;
    }
    const item: Item = {
      title: t('editor.fontSize.default.tooltip'),
      isActive: () => false,
    };
    return item;
  }, [props]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild
        disabled={props?.disabled}
      >
        <ActionMenuButton
          disabled={props?.disabled}
          icon="MenuDown"
          title={active?.title}
          tooltip={`${props?.tooltip}`}
          tooltipOptions={props?.tooltipOptions}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="richtext-max-h-96 richtext-w-32 richtext-overflow-y-auto">
        {props?.items?.map((item: any, index) => {
          return (
            <DropdownMenuCheckboxItem
              checked={active.title === item.title}
              key={`font-size-${index}`}
              onClick={item.action}
            >
              <div className="richtext-ml-1 richtext-h-full">
                {item.title}
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FontSizeMenuButton;
