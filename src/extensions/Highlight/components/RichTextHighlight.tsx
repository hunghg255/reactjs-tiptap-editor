import React, { useEffect, useState } from 'react';

import { ActionButton, ColorPicker } from '@/components';
import { IconComponent } from '@/components/icons';
import { IconHighlightFill } from '@/components/icons/IconHighlightFill';
import { Highlight } from '@/extensions/Highlight/Highlight';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

export function RichTextHighlight() {
  const buttonProps = useButtonProps(Highlight.name);

  const {
    tooltip = undefined,
    isActive = undefined,
    defaultColor = undefined,
    colors,
    action,
    shortcutKeys,
  } = buttonProps?.componentProps ?? {};

  const { disabled, dataState } = useActive(isActive);

  const [selectedColor, setSelectedColor] = useState<any>(defaultColor);

  useEffect(() => {
    setSelectedColor(dataState);
  }, [dataState]);

  function onChange(color: any) {
    if (disabled) return;

    if (action) {
      action?.(color);
      setSelectedColor(color);
    }
  }

  if (!buttonProps) {
    return <></>;
  }

  return (
    <ColorPicker
      colors={colors}
      disabled={disabled}
      highlight
      onChange={onChange}
      value={selectedColor}
    >
      <ActionButton
        disabled={disabled}
        tooltip={tooltip}
        // tooltipOptions={tooltipOptions}
        shortcutKeys={shortcutKeys}
      >
        <span className='richtext-flex richtext-items-center richtext-justify-center richtext-gap-[4px] richtext-text-sm'>
          <IconHighlightFill fill={dataState} />

          <IconComponent
            className='!richtext-h-3 !richtext-w-3 richtext-text-zinc-500'
            name='MenuDown'
          />
        </span>
      </ActionButton>
    </ColorPicker>
  );
}
