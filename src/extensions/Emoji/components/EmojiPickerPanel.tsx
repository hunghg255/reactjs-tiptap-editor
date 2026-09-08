import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/components/ui/emoji-picker';

export default function EmojiPickerPanel({
  onSelectEmoji,
}: {
  onSelectEmoji: (emoji: string) => void;
}) {
  return (
    <EmojiPicker
      className='!richtext-h-[342px]'
      onEmojiSelect={({ emoji }) => onSelectEmoji(emoji)}
    >
      <EmojiPickerSearch />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  );
}
