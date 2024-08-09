import React, { useMemo } from 'react';

import ActionMenuButton from '@/components/ActionMenuButton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/locales';
import { ButtonViewReturnComponentProps } from '@/types';

export interface Item {
  title: string;
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>;
  action?: ButtonViewReturnComponentProps['action'];
  style?: React.CSSProperties;
  disabled?: boolean;
  divider?: boolean;
  default?: boolean;
}

interface IPropsFontSizeMenuButton {
  editor: any;
  disabled?: boolean;
  color?: string;
  shortcutKeys?: string[];
  maxHeight?: string | number;
  tooltip?: string;
  items?: Item[];
}

const FontSizeMenuButton = (props: IPropsFontSizeMenuButton) => {
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
      <DropdownMenuTrigger disabled={props?.disabled}>
        <ActionMenuButton
          title={active?.title}
          tooltip={`${props?.tooltip}`}
          disabled={props?.disabled}
          icon='MenuDown'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-32 overflow-y-auto max-h-96'>
        {props?.items?.map((item: any, index) => {
          return (
            <DropdownMenuCheckboxItem
              key={index}
              checked={active.title === item.title}
              onClick={item.action}
            >
              <div className='ml-1 h-full'>{item.title}</div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeMenuButton;
