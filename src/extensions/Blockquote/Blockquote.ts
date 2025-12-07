import type { BlockquoteOptions as TiptapBlockquoteOptions } from '@tiptap/extension-blockquote';
import { Blockquote as TiptapBlockquote } from '@tiptap/extension-blockquote';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextBlockquote';

export interface BlockquoteOptions
  extends TiptapBlockquoteOptions,
  GeneralOptions<BlockquoteOptions> {}

export const Blockquote = /* @__PURE__ */ TiptapBlockquote.extend<BlockquoteOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'blockquote',
      },
      button: ({ editor, t, extension }: any) => ({
        componentProps: {
          action: () => editor.commands.toggleBlockquote(),
          isActive: () => editor.isActive('blockquote'),
          disabled: !editor.can().toggleBlockquote(),
          icon: 'TextQuote',
          shortcutKeys: extension.options.shortcutKeys ?? ['shift', 'mod', 'B'],
          tooltip: t('editor.blockquote.tooltip'),
        },
      }),
    };
  },
});
