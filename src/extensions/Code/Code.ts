import type { CodeOptions as TiptapCodeOptions } from '@tiptap/extension-code'
import { Code as TiptapCode } from '@tiptap/extension-code'

import { ActionButton } from '@/components'
import type { GeneralOptions } from '@/types'

export interface CodeOptions extends TiptapCodeOptions, GeneralOptions<CodeOptions> {}

export const Code = TiptapCode.extend<CodeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleCode(),
          isActive: () => editor.isActive('code') || false,
          disabled: !editor.can().toggleCode(),
          icon: 'Code',
          shortcutKeys: ['mod', 'E'],
          tooltip: t('editor.code.tooltip'),
        },
      }),
    }
  },
})
