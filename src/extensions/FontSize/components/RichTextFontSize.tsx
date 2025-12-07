import React, { Fragment, useMemo } from 'react';

import {
  ActionMenuButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components';
import { FontSize } from '@/extensions/FontSize/FontSize';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useLocale } from '@/locales';
import type { ButtonViewReturnComponentProps } from '@/types';

export interface Item {
  title: string
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  disabled?: boolean
  divider?: boolean
  default?: boolean
}

export function RichTextFontSize() {
  const { t } = useLocale();
  const buttonProps = useButtonProps(FontSize.name);

  const {
    icon = undefined,
    tooltip = undefined,
    items = [],
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { disabled, dataState } = useActive(isActive);

  const title = useMemo(() => {
    return (dataState as any)?.title || t('editor.fontSize.default.tooltip');
  }, [dataState]);

  if (!buttonProps) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild
        disabled={disabled}
      >
        <ActionMenuButton
          disabled={disabled}
          icon={icon}
          title={title}
          tooltip={tooltip}
        // tooltipOptions={tooltipOptions}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="richtext-max-h-96 richtext-w-32 richtext-overflow-y-auto">
        {items?.map((item: any, index: any) => {
          return (
            <Fragment key={`font-size-${index}`}>
              <DropdownMenuCheckboxItem
                checked={title === item.title}
                onClick={item.action}
              >
                <div className="richtext-ml-1 richtext-h-full">
                  {item.title}
                </div>
              </DropdownMenuCheckboxItem>

              {item.title === t('editor.fontSize.default.tooltip') && <DropdownMenuSeparator />}
            </Fragment>

          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
