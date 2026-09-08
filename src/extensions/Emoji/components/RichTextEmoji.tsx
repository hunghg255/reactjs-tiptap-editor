import { useState } from 'react';

import { ActionButton, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { LazyContent } from '@/components/LazyContent';
import { Emoji } from '@/extensions/Emoji/Emoji';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

import type React from 'react';

const loadPicker = () => import('./EmojiPickerPanel');

interface IProps {
  showClear?: boolean;
  onSelectEmoji: (arg: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

function EmojiPickerWrap({ onSelectEmoji, children, disabled }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    if (disabled) return;

    setIsOpen(open);
  };

  return (
    <Popover onOpenChange={onOpenChange} open={isOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className='!richtext-w-fit !richtext-p-0'>
        {isOpen && (
          <LazyContent
            load={loadPicker}
            componentProps={{
              onSelectEmoji: (emoji: string) => {
                onSelectEmoji(emoji);
                setIsOpen(false);
              },
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export function RichTextEmoji() {
  const buttonProps = useButtonProps(Emoji.name);

  const {
    icon = undefined,
    tooltip = undefined,
    isActive = undefined,
    action,
  } = buttonProps?.componentProps ?? {};

  const { disabled } = useActive(isActive);

  if (!buttonProps) {
    return <></>;
  }

  const onAction = (emoji: string) => {
    if (disabled) return;

    if (action) action(emoji);
  };

  return (
    <EmojiPickerWrap disabled={disabled} onSelectEmoji={onAction}>
      <ActionButton
        icon={icon}
        tooltip={tooltip}
        disabled={disabled}
        // tooltipOptions={tooltipOptions}
      />
    </EmojiPickerWrap>
  );
}
