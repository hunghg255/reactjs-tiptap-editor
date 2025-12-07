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

export const Color = /* @__PURE__ */ TiptapColor.extend<ColorOptions>({
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
            tooltip: t('editor.color.tooltip'),
          },
        };
      },
    };
  },
});
