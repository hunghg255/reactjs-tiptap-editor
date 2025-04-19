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
              if (color === undefined) {
                editor.chain().focus().unsetColor().run();
              }
              if (typeof color === 'string') {
                editor.chain().focus().setColor(color).run();
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
            disabled: false,
            tooltip: t('editor.color.tooltip'),
          },
        };
      },
    };
  },
});
