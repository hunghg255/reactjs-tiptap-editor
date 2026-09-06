import React, { Fragment, useMemo } from 'react';

import {
  ActionMenuButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components';
import { FontFamily } from '@/extensions/FontFamily/FontFamily';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useLocale } from '@/locales';

import type { ButtonViewReturnComponentProps } from '@/types';

export interface Item {
  title: string;
  icon?: string;
  font?: string;
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>;
  action?: ButtonViewReturnComponentProps['action'];
  style?: React.CSSProperties;
  shortcutKeys?: string[];
  disabled?: boolean;
  divider?: boolean;
  default?: boolean;
}

export function RichTextFontFamily() {
  const { t } = useLocale();

  const buttonProps = useButtonProps<{
    icon?: string;
    tooltip?: string;
    items?: Item[];
    isActive?: () => Item | boolean;
  }>(FontFamily.name);

  const {
    icon = undefined,
    tooltip = undefined,
    items = [],
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { disabled, dataState } = useActive(isActive);

  const title = useMemo(() => {
    return (
      (typeof dataState === 'object' ? dataState?.font : undefined) ||
      t('editor.fontFamily.default.tooltip')
    );
  }, [dataState]);

  if (!buttonProps) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <ActionMenuButton
          disabled={disabled}
          icon={icon}
          title={title?.length > 12 ? `${title?.slice(0, 12)}...` : title}
          tooltip={tooltip}
          // tooltipOptions={tooltipOptions}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='richtext-w-full'>
        {items?.map((item, index) => {
          const style =
            item.font === t('editor.fontFamily.default.tooltip') ? {} : { fontFamily: item.font };

          return (
            <Fragment key={`font-family-${index}`}>
              <DropdownMenuCheckboxItem checked={title === item.font} onClick={item.action}>
                <div className='richtext-ml-1 richtext-h-full' style={style}>
                  {item.font}
                </div>
              </DropdownMenuCheckboxItem>

              {item.font === t('editor.fontFamily.default.tooltip') && <DropdownMenuSeparator />}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
