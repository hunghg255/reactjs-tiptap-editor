import type { UnderlineOptions as TiptapUnderlineOptions } from '@tiptap/extension-underline'
import TiptapUnderline from '@tiptap/extension-underline'

import { ActionButton } from '@/components'
import type { GeneralOptions } from '@/types'

export interface UnderlineOptions
  extends TiptapUnderlineOptions,
  GeneralOptions<UnderlineOptions> {}

export const Underline = TiptapUnderline.extend<UnderlineOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: any) {
        return {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.toggleUnderline(),
            isActive: () => editor.isActive('underline') || false,
            disabled: !editor.can().toggleUnderline(),
            icon: 'Underline',
            shortcutKeys: ['mod', 'U'],
            tooltip: t('editor.underline.tooltip'),
          },
        }
      },
    }
  },
})
