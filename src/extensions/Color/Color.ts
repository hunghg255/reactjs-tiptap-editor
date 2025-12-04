import TiptapColor from '@tiptap/extension-color';
import type { ColorOptions as TiptapColorOptions } from '@tiptap/extension-color';

import ColorActionButton from '@/extensions/Color/components/ColorActionButton';
import type { GeneralOptions } from '@/types';

export interface ColorOptions extends TiptapColorOptions, GeneralOptions<ColorOptions> {
  /**
   * An array of color options to display in the color picker
   */
  colors?: string[]

  /**
   * The default color to use when no color is selected
   */
  defaultColor?: string
}

export const Color = /* @__PURE__ */ TiptapColor.extend<ColorOptions>({
  addStorage() {
    return {
      // Stores the currently selected text color; undefined indicates "No Fill" (default color)
      currentColor: this.options.defaultColor || undefined,
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t, extension }) {
        return {
          component: ColorActionButton,
          componentProps: {
            colors: extension.options.colors,
            defaultColor: extension.options.defaultColor,
            action: (color?: unknown) => {
              if (typeof color === 'string') {
                // Update the stored current color
                extension.storage.currentColor = color;
                editor.chain().focus().setColor(color).run();
              }
              if (color === undefined) {
                // Clear the color and set currentColor to undefined
                extension.storage.currentColor = undefined;
                editor.chain().focus().unsetColor().run();
              }
            },
            isActive: () => {
              const { color } = editor.getAttributes('textStyle');
              if (!color) {
                return false;
              }
              return editor.isActive({ color }) || false;
            },
            editor,
            extension,
            disabled: false,
            shortcutKeys: extension.options.shortcutKeys ?? ['⇧', 'alt', 'C'],
            tooltip: t('editor.color.tooltip'),
          },
        };
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Alt-Shift-c': () => {
        // Use the stored current color
        const colorToUse = this.storage.currentColor || this.options.defaultColor;

        // If currentColor is undefined (indicating No Fill/default), do not perform color operation
        if (!colorToUse) {
          return false;
        }

        // Check if there is already a text color
        const { color: currentTextColor } = this.editor.getAttributes('textStyle');

        if (currentTextColor) {
          // If the current text color is the same as colorToUse, remove it
          if (currentTextColor === colorToUse) {
            return this.editor.chain().focus().unsetColor().run();
          }

          // Otherwise, replace with the new color
          return this.editor.chain().focus().setColor(colorToUse).run();
        }

        // If there is no color, add it
        return this.editor.chain().focus().setColor(colorToUse).run();
      },
    };
  },
});
