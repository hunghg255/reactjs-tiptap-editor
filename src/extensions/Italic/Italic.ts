import type { Editor } from '@tiptap/core'
import type { ItalicOptions as TiptapItalicOptions } from '@tiptap/extension-italic'
import TiptapItalic from '@tiptap/extension-italic'

import { ActionButton } from '@/components'
import type { GeneralOptions } from '@/types'

export interface ItalicOptions extends TiptapItalicOptions, GeneralOptions<ItalicOptions> {}

export const Italic = TiptapItalic.extend<ItalicOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor, t: (...args: any[]) => string }) {
        return {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.toggleItalic(),
            isActive: () => editor.isActive('italic') || false,
            disabled: !editor.can().toggleItalic(),
            shortcutKeys: ['mod', 'I'],
            icon: 'Italic',
            tooltip: t('editor.italic.tooltip'),
          },
        }
      },
    }
  },
})
