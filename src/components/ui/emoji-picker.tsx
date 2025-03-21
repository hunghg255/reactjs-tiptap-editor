'use client';

import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from 'frimousse';
import { LoaderIcon, SearchIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function EmojiPicker({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      className={cn(
        'richtext-bg-popover richtext-text-popover-foreground richtext-isolate richtext-flex richtext-h-full richtext-w-fit richtext-flex-col richtext-overflow-hidden richtext-rounded-md',
        className
      )}
      data-slot="emoji-picker"
      {...props}
    />
  );
}

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <div
      className={cn('richtext-flex richtext-h-9 richtext-items-center richtext-gap-2 richtext-border-b richtext-px-3', className)}
      data-slot="emoji-picker-search-wrapper"
    >
      <SearchIcon className="richtext-size-4 richtext-shrink-0 richtext-opacity-50" />
      <EmojiPickerPrimitive.Search
        className="richtext-outline-hidden placeholder:richtext-text-muted-foreground richtext-flex richtext-h-10 richtext-w-full richtext-rounded-md richtext-bg-transparent richtext-py-3 richtext-text-sm disabled:richtext-cursor-not-allowed disabled:richtext-opacity-50"
        data-slot="emoji-picker-search"
        {...props}
      />
    </div>
  );
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="richtext-scroll-my-1 richtext-px-1" data-slot="emoji-picker-row">
      {children}
    </div>
  );
}

function EmojiPickerEmoji({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      className={cn(
        'data-[active]:richtext-bg-accent richtext-flex richtext-size-7 richtext-items-center richtext-justify-center richtext-rounded-sm richtext-text-base',
        className
      )}
      data-slot="emoji-picker-emoji"
    >
      {emoji.emoji}
    </button>
  );
}

function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="richtext-bg-popover richtext-text-muted-foreground richtext-px-3 richtext-pb-2 richtext-pt-3.5 richtext-text-xs richtext-leading-none"
      data-slot="emoji-picker-category-header"
    >
      {category.label}
    </div>
  );
}

function EmojiPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      className={cn('richtext-outline-hidden richtext-relative richtext-flex-1', className)}
      data-slot="emoji-picker-viewport"
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        className="richtext-absolute richtext-inset-0 richtext-flex richtext-items-center richtext-justify-center richtext-text-muted-foreground"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="richtext-size-4 richtext-animate-spin" />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        className="richtext-absolute richtext-inset-0 richtext-flex richtext-items-center richtext-justify-center richtext-text-muted-foreground richtext-text-sm"
        data-slot="emoji-picker-empty"
      >
        No emoji found.
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List
        className="richtext-select-none richtext-pb-1"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
        data-slot="emoji-picker-list"
      />
    </EmojiPickerPrimitive.Viewport>
  );
}

function EmojiPickerFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'richtext-max-w-(--frimousse-viewport-width) richtext-flex richtext-w-full richtext-min-w-0 richtext-items-center richtext-gap-1 richtext-border-t richtext-p-2',
        className
      )}
      data-slot="emoji-picker-footer"
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <div className="richtext-flex richtext-size-7 richtext-flex-none richtext-items-center richtext-justify-center richtext-text-lg">
                {emoji.emoji}
              </div>
              <span className="richtext-text-secondary-foreground richtext-truncate richtext-text-xs">
                {emoji.label}
              </span>
            </>
          ) : (
            <span className="richtext-text-muted-foreground richtext-ml-1.5 richtext-flex richtext-h-7 richtext-items-center richtext-truncate richtext-text-xs">
              Select an emoji…
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
    </div>
  );
}

export {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
};