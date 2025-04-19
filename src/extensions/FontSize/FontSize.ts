import { Extension } from '@tiptap/core';

import { DEFAULT_FONT_SIZE_LIST, DEFAULT_FONT_SIZE_VALUE } from '@/constants';
import type { GeneralOptions, NameValueOption } from '@/types';
import { ensureNameValueOptions } from '@/utils/utils';

import FontSizeMenuButton from './components/FontSizeMenuButton';

export {
  DEFAULT_FONT_SIZE_LIST
};

/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface FontSizeOptions extends GeneralOptions<FontSizeOptions> {
  types: string[]
  /**
   * List of available font size values
   *
   * @default DEFAULT_FONT_SIZE_LIST
   */
  fontSizes: (string | NameValueOption)[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the text font size. ex: "12px", "2em", or "small". Must be a valid
       * CSS font-size
       * (https://developer.mozilla.org/en-US/docs/Web/CSS/font-size).
       */
      setFontSize: (fontSize: string) => ReturnType
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = /* @__PURE__ */ Extension.create<FontSizeOptions>({
  name: 'fontSize',
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['textStyle'],
      fontSizes: [...DEFAULT_FONT_SIZE_LIST],
      button({ editor, extension, t }) {
        const fontSizes = ensureNameValueOptions(extension.options?.fontSizes || DEFAULT_FONT_SIZE_VALUE);
        const defaultFontSize = ensureNameValueOptions([DEFAULT_FONT_SIZE_VALUE])[0];
        const items = fontSizes.map(k => ({
          title: k.value === defaultFontSize.value ? t('editor.fontSize.default.tooltip') : String(k.name),
          isActive: () => {
            const { fontSize } = editor.getAttributes('textStyle');
            const isDefault = k.value === defaultFontSize.value;
            const notFontSize = fontSize === undefined;
            if (isDefault && notFontSize) {
              return true;
            }
            return editor.isActive({ fontSize: String(k.value) }) || false;
          },
          action: () => {
            if (k.value === defaultFontSize.value) {
              editor.commands.unsetFontSize();
              return;
            }
            editor.commands.setFontSize(String(k.value));
          },
          disabled: !editor.can().setFontSize(String(k.value)),
          divider: k.value === defaultFontSize.value || false,
          default: k.value === defaultFontSize.value || false,
        }));
        // const disabled = items.filter(k => k.disabled).length === items.length;
        return {
          component: FontSizeMenuButton,
          componentProps: {
            editor,
            tooltip: t('editor.fontSize.tooltip'),
            disabled: false,
            items,
            maxHeight: 280,
          },
        };
      },
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replaceAll(/["']+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        fontSize =>
          ({ chain }) => {
            return chain().setMark('textStyle', { fontSize }).run();
          },
      unsetFontSize:
        () =>
          ({ chain }) => {
            return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
          },
    };
  },
});
