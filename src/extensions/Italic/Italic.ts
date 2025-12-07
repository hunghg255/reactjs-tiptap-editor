import type { ItalicOptions as TiptapItalicOptions } from '@tiptap/extension-italic';
import TiptapItalic from '@tiptap/extension-italic';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextItalic';

export interface ItalicOptions extends TiptapItalicOptions, GeneralOptions<ItalicOptions> {}

export const Italic = /* @__PURE__ */ TiptapItalic.extend<ItalicOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t, extension }) {
        return {
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
