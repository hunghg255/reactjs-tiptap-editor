import type { ItalicOptions as TiptapItalicOptions } from '@tiptap/extension-italic';
import TiptapItalic from '@tiptap/extension-italic';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

export interface ItalicOptions extends TiptapItalicOptions, GeneralOptions<ItalicOptions> {}

export const Italic = /* @__PURE__ */ TiptapItalic.extend<ItalicOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t, extension }) {
        return {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.toggleItalic(),
            isActive: () => editor.isActive('italic') || false,
            disabled: false,
            shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'I'],
            icon: 'Italic',
            tooltip: t('editor.italic.tooltip'),
          },
        };
      },
    };
  },
});
