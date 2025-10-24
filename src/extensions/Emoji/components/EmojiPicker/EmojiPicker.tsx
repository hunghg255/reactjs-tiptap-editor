import type React from 'react';
import { useCallback, useState } from 'react';

import { ActionButton, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';

interface IProps {
  showClear?: boolean
  onSelectEmoji: (arg: string) => void
  children: React.ReactNode
}

function EmojiPickerWrap({ onSelectEmoji, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover onOpenChange={setIsOpen}
      open={isOpen}
    >
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>

      <PopoverContent className="!richtext-w-fit !richtext-p-0">
        <EmojiPicker
          className="!richtext-h-[342px]"
          onEmojiSelect={({ emoji }) => {
            setIsOpen(false);
            onSelectEmoji(emoji);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}

export function EmojiPickerComponent({ editor, icon, ...props }: any) {
  const setEmoji = useCallback(
    (emoji: any) => {
      const { selection } = editor.state;
      const { $anchor } = selection;
      return editor.chain().insertContentAt($anchor.pos, emoji).run();
    },
    [editor],
  );

  return (
    <EmojiPickerWrap onSelectEmoji={setEmoji}>
      <ActionButton
        icon={icon}
        tooltip={props?.tooltip}
        tooltipOptions={props?.tooltipOptions}
      />
    </EmojiPickerWrap>
  );
}

export default EmojiPickerComponent;
