import type { BoldOptions as TiptapImageOptions } from '@tiptap/extension-bold'
import { Bold as TiptapBold } from '@tiptap/extension-bold'

import { ActionButton } from '@/components'
import type { GeneralOptions } from '@/types'

export interface BoldOptions extends TiptapImageOptions, GeneralOptions<BoldOptions> {}

export const Bold = TiptapBold.extend<BoldOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: any) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleBold(),
          isActive: () => editor.isActive('bold') || false,
          disabled: !editor.can().toggleBold(),
          icon: 'Bold',
          shortcutKeys: ['mod', 'B'],
          tooltip: t('editor.bold.tooltip'),
        },
      }),
    }
  },
})
