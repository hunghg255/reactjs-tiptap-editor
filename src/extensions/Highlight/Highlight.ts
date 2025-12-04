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
  addStorage() {
    return {
      // Stores the currently selected highlight color; undefined indicates "No Fill".
      currentColor: this.options.defaultColor || undefined,
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button: ({ editor, t, extension }) => ({
        component: HighlightActionButton,
        componentProps: {
          action: (color?: unknown) => {
            if (typeof color === 'string') {
              // Update the stored current color
              extension.storage.currentColor = color;
              editor.chain().focus().setHighlight({ color }).run();
            }
            if (color === undefined) {
              // Clear the highlight and set currentColor to undefined
              extension.storage.currentColor = undefined;
              editor.chain().focus().unsetHighlight().run();
            }
          },
          editor,
          extension,
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

        // If currentColor is undefined (indicating No Fill), do not perform highlight
        if (!colorToUse) {
          return false;
        }

        // Check if there is already a highlight
        if (this.editor.isActive('highlight')) {
          // Get the current highlight color
          const { color: currentHighlightColor } = this.editor.getAttributes('highlight');

          // If the current highlight color is the same as colorToUse, remove it
          if (currentHighlightColor === colorToUse) {
            return this.editor.chain().focus().unsetHighlight().run();
          }

          // Otherwise, replace with the new color
          return this.editor.chain().focus().setHighlight({ color: colorToUse }).run();
        }

        // If there is no highlight, add it
        return this.editor.chain().focus().setHighlight({ color: colorToUse }).run();
      },
    };
  },
});
