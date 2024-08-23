import { Extension } from '@tiptap/core'

import type { GeneralOptions } from '@/types'
import ImportWordButton from '@/extensions/ImportWord/components/ImportWordButton'

export interface ImportWordOptions extends GeneralOptions<ImportWordOptions> {
  /**
   * 将word 转换成html的接口
   */
  convert?: (file: File) => Promise<string>

  /** Function for uploading images */
  upload?: (files: File[]) => Promise<unknown>
}

export const ImportWord = Extension.create<ImportWordOptions>({
  name: 'importWord',
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      convert: undefined,
      button: ({ editor, extension, t }: any) => {
        const { convert } = extension.options
        return {
          component: ImportWordButton,
          componentProps: {
            convert,
            action: () => editor.commands.setHorizontalRule(),
            disabled: !editor.can().setHorizontalRule(),
            icon: 'Word',
            shortcutKeys: ['alt', 'mod', 'S'],
            tooltip: t('editor.importWrod.tooltip'),
          },
        }
      },
    }
  },
})
