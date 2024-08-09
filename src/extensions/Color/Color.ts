import TiptapColor from '@tiptap/extension-color';
import type { ColorOptions as TiptapColorOptions } from '@tiptap/extension-color';

import ColorActionButton from '@/extensions/Color/components/ColorActionButton';
import type { GeneralOptions } from '@/types';

export interface ColorOptions extends TiptapColorOptions, GeneralOptions<ColorOptions> {}

export const Color = TiptapColor.extend<ColorOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }) {
        return {
          component: ColorActionButton,
          componentProps: {
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
            disabled: !editor.can().setColor(''),
            tooltip: t('editor.color.tooltip'),
          },
        };
      },
    };
  },
});
