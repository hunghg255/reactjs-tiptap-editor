/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { HighlightOptions as TiptapHighlightOptions } from '@tiptap/extension-highlight';
import { Highlight as TiptapHighlight } from '@tiptap/extension-highlight';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextHighlight';

export interface HighlightOptions extends TiptapHighlightOptions, GeneralOptions<HighlightOptions> {
  /**
   * The default color to use initially
   */
  defaultColor?: string
}

export const Highlight = /* @__PURE__ */ TiptapHighlight.extend<HighlightOptions>({
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button: ({ editor, t, extension }) => ({
        componentProps: {
          action: (color?: unknown) => {
            if (typeof color === 'string') {
              editor.chain().focus().setHighlight({ color }).run();
              return;
            }
            editor.chain().focus().unsetHighlight().run();
          },
          isActive: () => editor.isActive('highlight') || false,
          disabled: false,
          shortcutKeys: extension.options.shortcutKeys ?? ['⇧', 'mod', 'H'],
          tooltip: t('editor.highlight.tooltip'),
          defaultColor: extension.options.defaultColor
        },
      }),
    };
  },
});
