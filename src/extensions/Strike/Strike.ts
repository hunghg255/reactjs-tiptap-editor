import type { StrikeOptions as TiptapStrikeOptions } from '@tiptap/extension-strike'
import { Strike as TiptapStrike } from '@tiptap/extension-strike'

import { ActionButton } from '@/components'
import type { GeneralOptions } from '@/types'

export interface StrikeOptions extends TiptapStrikeOptions, GeneralOptions<StrikeOptions> {}

export const Strike = TiptapStrike.extend<StrikeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: any) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleStrike(),
          isActive: () => editor.isActive('strike') || false,
          disabled: !editor.can().toggleStrike(),
          icon: 'Strikethrough',
          shortcutKeys: ['shift', 'mod', 'S'],
          tooltip: t('editor.strike.tooltip'),
        },
      }),
    }
  },
})
