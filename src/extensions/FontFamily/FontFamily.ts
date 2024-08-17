import type { Extension } from '@tiptap/core'
import type { FontFamilyOptions as TiptapFontFamilyOptions } from '@tiptap/extension-font-family'
import FontFamilyTiptap from '@tiptap/extension-font-family'

import type { BaseKitOptions } from '../BaseKit'
import FontFamilyButton from '@/extensions/FontFamily/components/FontFamilyButton'
import type { GeneralOptions } from '@/types'

// export interface FontFamilyOptions extends , GeneralOptions<FontFamilyOptions> {}
export interface FontFamilyOptions extends TiptapFontFamilyOptions, GeneralOptions<FontFamilyOptions> {}

export const FontFamily = FontFamilyTiptap.extend<FontFamilyOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      fonts: ['Inter', 'Comic Sans MS, Comic Sans', 'serif', 'monospace', 'cursive'],
      button({ editor, extension, t }: any) {
        const { extensions = [] } = editor.extensionManager ?? []
        const fonts = extension?.options?.fonts || []
        const baseKitExt = extensions.find(
          (k: any) => k.name === 'base-kit',
        ) as Extension<BaseKitOptions>

        const items: any[] = fonts.map((font: any) => ({
          action: () => {
            editor.chain().focus().setFontFamily(font).run()
          },
          isActive: () => editor.isActive('textStyle', { fontFamily: font }) || false,
          disabled: !editor.can().setFontFamily(font),
          title: font,
          font,
        }))

        if (baseKitExt && baseKitExt.options.textStyle !== false) {
          items.unshift({
            action: () => editor.chain().focus().unsetFontFamily().run(),
            isActive: () => false,
            disabled: false,
            font: t('editor.fontFamily.default.tooltip'),
            title: t('editor.fontFamily.tooltip'),
          })
        }

        const disabled = items.filter((k: any) => k.disabled).length === items.length

        return {
          component: FontFamilyButton,
          componentProps: {
            tooltip: t('editor.fontFamily.tooltip'),
            disabled,
            items,
            editor,
          },
        }
      },
    }
  },
})
