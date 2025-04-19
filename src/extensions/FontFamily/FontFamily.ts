import type { Extension } from '@tiptap/core';
import type { FontFamilyOptions as TiptapFontFamilyOptions } from '@tiptap/extension-font-family';
import FontFamilyTiptap from '@tiptap/extension-font-family';

import { DEFAULT_FONT_FAMILY_LIST } from '@/constants';
import FontFamilyButton from '@/extensions/FontFamily/components/FontFamilyButton';
import type { GeneralOptions, NameValueOption } from '@/types';
import { ensureNameValueOptions } from '@/utils/utils';

import type { BaseKitOptions } from '../BaseKit';

export {
  DEFAULT_FONT_FAMILY_LIST
};

export interface FontFamilyOptions extends TiptapFontFamilyOptions, GeneralOptions<FontFamilyOptions> {
  /**
   * Font family list.
   */
  fontFamilyList: (string | NameValueOption)[]
}

export const FontFamily = /* @__PURE__ */ FontFamilyTiptap.extend<FontFamilyOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      fontFamilyList: DEFAULT_FONT_FAMILY_LIST,
      button({ editor, extension, t }: any) {
        const { extensions = [] } = editor.extensionManager ?? [];
        const fontFamilyList = ensureNameValueOptions(extension?.options?.fontFamilyList || []);
        const baseKitExt = extensions.find(
          (k: any) => k.name === 'base-kit',
        ) as Extension<BaseKitOptions>;

        const items = fontFamilyList.map(font => ({
          action: () => {
            editor.chain().focus().setFontFamily(font.value).run();
          },
          isActive: () => editor.isActive('textStyle', { fontFamily: font.value }) || false,
          disabled: !editor.can().setFontFamily(font.value),
          title: font.name,
          font: font.value,
        }));

        if (baseKitExt && baseKitExt.options.textStyle !== false) {
          items.unshift({
            action: () => editor.chain().focus().unsetFontFamily().run(),
            isActive: () => false,
            disabled: false,
            font: t('editor.fontFamily.default.tooltip'),
            title: t('editor.fontFamily.tooltip'),
          });
        }

        const disabled = items.filter((k: any) => k.disabled).length === items.length;

        return {
          component: FontFamilyButton,
          componentProps: {
            tooltip: t('editor.fontFamily.tooltip'),
            disabled,
            items,
            editor,
          },
        };
      },
    };
  },
});
