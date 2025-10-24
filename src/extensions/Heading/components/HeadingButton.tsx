import React, { Fragment, useMemo } from 'react';

import {
  ActionMenuButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKey } from '@/utils/plateform';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export interface Item {
  title: string
  icon?: any
  level?: number
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}

interface Props {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  tooltipOptions?: TooltipContentProps
  items?: Item[]
}

function HeadingButton(props: Props) {
  const active = useMemo(() => {
    const find: any = props?.items?.find((k: any) => k.isActive());

    if (find && !find.default) {
      return {
        ...find,
      };
    }
    const item: Item = {
      title: props.tooltip as any,
      level: 0,
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
          tooltip={props?.tooltip}
          tooltipOptions={props?.tooltipOptions}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="richtext-w-full">
        {props?.items?.map((item: any, index) => {
          return (
            <Fragment key={`heading-k-${index}`}>
              <DropdownMenuCheckboxItem
                checked={active?.title === item.title}
                onClick={item.action}
              >
                <div className={`heading- richtext-ml-1 richtext-h-full${item.level}`}>
                  {item.title}
                </div>

                {!!item?.shortcutKeys?.length && (
                  <DropdownMenuShortcut className="richtext-pl-4">
                    {item?.shortcutKeys?.map((item: any) => getShortcutKey(item)).join(' ')}
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuCheckboxItem>

              {item.level === 0 && <DropdownMenuSeparator />}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeadingButton;
