import { useEffect, useState } from 'react';

import { ActionButton, ColorPicker } from '@/components';
import { IconComponent } from '@/components/icons';
import { IconColorFill } from '@/components/icons/IconColorFill';
import { Color } from '@/extensions/Color/Color';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

export function RichTextColor() {
  const buttonProps = useButtonProps(Color.name);

  const {
    tooltip = undefined,
    isActive = undefined,
    defaultColor = undefined,
    colors,
    action
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
      onChange={onChange}
      value={selectedColor}
    >
      <ActionButton
        disabled={disabled}
        tooltip={tooltip}
      // tooltipOptions={tooltipOptions}
      >
        <span className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-[4px] richtext-text-sm">
          <IconColorFill fill={dataState} />

          <IconComponent className="!richtext-h-3 !richtext-w-3 richtext-text-zinc-500"
            name="MenuDown"
          />

        </span>
      </ActionButton>
    </ColorPicker>
  );
}
