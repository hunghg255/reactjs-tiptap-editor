import type { StrikeOptions as TiptapStrikeOptions } from '@tiptap/extension-strike';
import { Strike as TiptapStrike } from '@tiptap/extension-strike';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

export interface StrikeOptions extends TiptapStrikeOptions, GeneralOptions<StrikeOptions> {}

export const Strike = /* @__PURE__ */ TiptapStrike.extend<StrikeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }: any) => ({
        component: ActionButton,
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
