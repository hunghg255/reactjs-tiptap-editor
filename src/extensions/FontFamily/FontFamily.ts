import { FontFamily as FontFamilyTiptap, type FontFamilyOptions as TiptapFontFamilyOptions } from '@tiptap/extension-text-style';

import { DEFAULT_FONT_FAMILY_LIST } from '@/constants';
import type { GeneralOptions, NameValueOption } from '@/types';
import { ensureNameValueOptions } from '@/utils/utils';

export * from './components/RichTextFontFamily';

export interface FontFamilyOptions extends TiptapFontFamilyOptions, GeneralOptions<FontFamilyOptions> {
  /**
   * Font family list.
   */
  fontFamilyList: (string | NameValueOption)[]
}

export const FontFamily = /* @__PURE__ */ FontFamilyTiptap.extend<FontFamilyOptions>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      fontFamilyList: DEFAULT_FONT_FAMILY_LIST,
      button({ editor, extension, t }: any) {
        const fontFamilyList = ensureNameValueOptions(extension?.options?.fontFamilyList || []);

        const items = fontFamilyList.map(font => ({
          action: () => {
            if (font.value === 'Default') {
              editor.chain().focus().unsetFontFamily().run();
              return;
            }
            editor.chain().focus().setFontFamily(font.value).run();
          },
          isActive: () => editor.isActive('textStyle', { fontFamily: font.value }) || false,
          // disabled: !editor.can().setFontFamily(font.value),
          title: font.name,
          font: font.value,
          default: font.value === 'Default',
        }));

        return {
          // component: FontFamilyButton,
          componentProps: {
            tooltip: t('editor.fontFamily.tooltip'),
            disabled: false,
            items,
            isActive: () => {
              const find: any = items?.find((k: any) => k.isActive());

              if (find && !find.default) {
                return find;
              }

              const item = {
                title: t('editor.fontFamily.default.tooltip'),
                font: t('editor.fontFamily.default.tooltip'),
                isActive: () => false,
                disabled: false,
              };
              return item;
            },
            icon: 'MenuDown',
            fontFamilyList
          },
        };
      },
    };
  },
});
