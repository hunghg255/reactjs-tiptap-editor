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

export interface HighlightStorage {
  currentColor?: string
}

declare module '@tiptap/core' {
  interface Storage {
    highlight: HighlightStorage
  }
}

export const Highlight = /* @__PURE__ */ TiptapHighlight.extend<HighlightOptions>({
  addStorage() {
    return {
      // Stores the currently selected highlight color; undefined indicates "No Fill".
      currentColor: this.options.defaultColor || undefined,
    };
  },

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button: ({ editor, t, extension }) => ({
        componentProps: {
          action: (color?: unknown) => {
            if (typeof color === 'string') {
              // Update the stored current color
              editor.storage.highlight.currentColor = color;
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

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-Shift-h': () => {
        // Use the stored current color
        const colorToUse = this.storage.currentColor || this.options.defaultColor;

        // If colorToUse is undefined, remove any existing highlight
        if (!colorToUse) {
          const { color: currentHighlightColor } = this.editor.getAttributes('highlight');
          if (currentHighlightColor) {
            return this.editor.chain().focus().unsetHighlight().run();
          }
          return false;
        }

        // Check if the ENTIRE selection has the exact same highlight color
        const isExactColorActive = this.editor.isActive('highlight', { color: colorToUse });

        if (isExactColorActive) {
          // If the entire selection has this exact color, remove it
          return this.editor.chain().focus().unsetHighlight().run();
        }

        // Otherwise (no highlight, different color, or mixed state), apply the color
        return this.editor.chain().focus().setHighlight({ color: colorToUse }).run();
      },
    };
  },
});
