import { Extension } from '@tiptap/core';

import { DEFAULT_FONT_SIZE_LIST } from '@/constants';
import type { GeneralOptions, NameValueOption } from '@/types';
import { ensureNameValueOptions } from '@/utils/utils';

export * from './components/RichTextFontSize';

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['textStyle'],
      fontSizes: DEFAULT_FONT_SIZE_LIST,
      button({ editor, extension, t }) {
        const fontSizes = ensureNameValueOptions(extension.options?.fontSizes);

        const items = fontSizes.map(k => ({
          title: k.value === 'Default' ? t('editor.fontSize.default.tooltip') : String(k.name),
          isActive: () => {
            const { fontSize } = editor.getAttributes('textStyle');
            const isDefault = k.value === 'Default';
            const notFontSize = fontSize === undefined || fontSize === null || fontSize === '';
            if (isDefault && notFontSize) {
              return true;
            }
            return editor.isActive({ fontSize: String(k.value) }) || false;
          },
          action: () => {
            if (k.value === 'Default') {
              editor.commands.unsetFontSize();
              return;
            }
            editor.commands.setFontSize(String(k.value));
          },
          // disabled: !editor.can().setFontSize(String(k.value)),
          default: k.value === 'Default' || false,
        }));
        // const disabled = items.filter(k => k.disabled).length === items.length;
        return {
          // component: FontSizeMenuButton,
          componentProps: {
            editor,
            tooltip: t('editor.fontSize.tooltip'),
            disabled: false,
            items,
            maxHeight: 280,
            icon: 'MenuDown',
            isActive: () => {
              const find: any = (items || []).find((k: any) => k.isActive());
              if (find && !find.default) {
                return find;
              }
              const item = {
                title: t('editor.fontSize.default.tooltip'),
                isActive: () => false,
              };
              return item;
            }
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
