import type React from 'react';
import { useCallback } from 'react';

import { ActionButton, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';

interface IProps {
  showClear?: boolean
  onSelectEmoji: (arg: string) => void
  children: React.ReactNode
}

function EmojiPickerWrap({ onSelectEmoji, children }: IProps) {

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>

      <PopoverContent align="start"
        className="richtext-size-full richtext-p-2"
        hideWhenDetached
        side="bottom"
      >
        <EmojiPicker
          className="!richtext-h-[342px]"
          onEmojiSelect={({ emoji }) => {
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
      />
    </EmojiPickerWrap>
  );
}

export default EmojiPickerComponent;
