import type { StrikeOptions as TiptapStrikeOptions } from '@tiptap/extension-strike';
import { Strike as TiptapStrike } from '@tiptap/extension-strike';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextStrike';

export interface StrikeOptions extends TiptapStrikeOptions, GeneralOptions<StrikeOptions> {}

export const Strike = /* @__PURE__ */ TiptapStrike.extend<StrikeOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }: any) => ({
        componentProps: {
          action: () => editor.commands.toggleStrike(),
          isActive: () => editor.isActive('strike') || false,
          disabled: false,
          icon: 'Strikethrough',
          shortcutKeys: extension.options.shortcutKeys ?? ['shift', 'mod', 'S'],
          tooltip: t('editor.strike.tooltip'),
        },
      }),
    };
  },
});
