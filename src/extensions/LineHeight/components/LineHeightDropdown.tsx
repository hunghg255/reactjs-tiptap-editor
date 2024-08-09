import React, { useMemo, useState } from 'react';

import ActionButton from '@/components/ActionButton';
import Icon from '@/components/icons/Icon';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/locales';
import { ButtonViewReturnComponentProps } from '@/types';

interface IPropsLineHeightDropdown {
  editor: any;
  icon?: any;
  tooltip?: string;
  disabled?: boolean;
  action?: ButtonViewReturnComponentProps['action'];
  isActive?: ButtonViewReturnComponentProps['isActive'];
}

function percentageToDecimal(percentageString: any) {
  const percentage = Number.parseFloat(percentageString.replace('%', ''));
  const decimal = percentage / 100;
  return decimal;
}

const LineHeightDropdown = (props: IPropsLineHeightDropdown) => {
  const { t } = useLocale();
  const [value, setValue] = useState('default');

  function toggleLightheight(key: string) {
    if (key === 'default') {
      props.editor.commands.unsetLineHeight();
    } else {
      props.editor.commands.setLineHeight(key);
    }
    setValue(key);
  }

  const LineHeights = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lineHeightOptions = props.editor.extensionManager.extensions.find(
      (e: any) => e.name === 'lineHeight',
    )!.options;
    const a = lineHeightOptions.lineHeights;
    const b = a.map((item: any) => ({
      label: percentageToDecimal(item),
      value: item,
    }));

    b.unshift({
      label: t('editor.default'),
      value: 'default',
    });
    return b;
  }, [props]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={props?.disabled}>
        <ActionButton
          customClass='w-12'
          icon='LineHeight'
          tooltip={props?.tooltip}
          disabled={props?.disabled}
        >
          <Icon className='w-3 h-3 text-zinc-500 ml-1' name='MenuDown' />
        </ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-24'>
        {LineHeights?.map((item: any, index: any) => {
          return (
            <DropdownMenuCheckboxItem
              key={`lineHeight-${index}`}
              checked={item.value === value}
              onClick={() => toggleLightheight(item.value)}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LineHeightDropdown;
