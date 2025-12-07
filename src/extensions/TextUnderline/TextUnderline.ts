import type { UnderlineOptions as TiptapUnderlineOptions } from '@tiptap/extension-underline';
import TiptapUnderline from '@tiptap/extension-underline';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextUnderline';

export interface UnderlineOptions
  extends TiptapUnderlineOptions,
  GeneralOptions<UnderlineOptions> {}

export const TextUnderline = /* @__PURE__ */ TiptapUnderline.extend<UnderlineOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t, extension }: any) {
        return {
          componentProps: {
            action: () => editor.commands.toggleUnderline(),
            isActive: () => editor.isActive('underline') || false,
            disabled: false,
            icon: 'Underline',
            shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'U'],
            tooltip: t('editor.underline.tooltip'),
          },
        };
      },
    };
  },
});
