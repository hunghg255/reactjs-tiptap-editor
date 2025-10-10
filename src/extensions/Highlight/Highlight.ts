import type { HighlightOptions as TiptapHighlightOptions } from '@tiptap/extension-highlight';
import { Highlight as TiptapHighlight } from '@tiptap/extension-highlight';

import type { GeneralOptions } from '@/types';

import HighlightActionButton from './components/HighlightActionButton';

export interface HighlightOptions extends TiptapHighlightOptions, GeneralOptions<HighlightOptions> {
  /**
   * The default color to use initially
   */
  defaultColor?: string
}

export const Highlight = /* @__PURE__ */ TiptapHighlight.extend<HighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button: ({ editor, t, extension }) => ({
        component: HighlightActionButton,
        componentProps: {
          action: (color?: unknown) => {
            if (typeof color === 'string') {
              editor.chain().focus().setHighlight({ color }).run();
            }
            if (color === undefined) {
              editor.chain().focus().unsetHighlight().run();
            }
          },
          editor,
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
