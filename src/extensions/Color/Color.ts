import { Color as TiptapColor, type ColorOptions as TiptapColorOptions } from '@tiptap/extension-text-style';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextColor';

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

export interface ColorStorage {
  currentColor?: string
}

declare module '@tiptap/core' {
  interface Storage {
    color: ColorStorage
  }
}

export const Color = /* @__PURE__ */ TiptapColor.extend<ColorOptions>({
  addStorage() {
    return {
      // Stores the currently selected text color; undefined indicates "No Fill" (default color)
      currentColor: this.options.defaultColor || undefined,
    };
  },

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t, extension }) {
        return {
          // component: ColorActionButton,
          componentProps: {
            colors: extension.options.colors,
            defaultColor: extension.options.defaultColor,
            action: (color?: unknown) => {
              if (typeof color === 'string') {
                // Update the stored current color
                editor.storage.color.currentColor = color;
                editor.chain().focus().setColor(color).run();
                return;
              }

              editor.chain().focus().unsetColor().run();
            },
            isActive: () => {
              const { color } = editor.getAttributes('textStyle');

              return color;
            },
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

        // If colorToUse is undefined, remove any existing color
        if (!colorToUse) {
          const { color: currentTextColor } = this.editor.getAttributes('textStyle');
          if (currentTextColor) {
            return this.editor.chain().focus().unsetColor().run();
          }
          return false;
        }

        // Check if the ENTIRE selection has the exact same text color
        const isExactColorActive = this.editor.isActive('textStyle', { color: colorToUse });

        if (isExactColorActive) {
          // If the entire selection has this exact color, remove it
          return this.editor.chain().focus().unsetColor().run();
        }

        // Otherwise (no color, different color, or mixed state), apply the color
        return this.editor.chain().focus().setColor(colorToUse).run();
      },
    };
  },
});
