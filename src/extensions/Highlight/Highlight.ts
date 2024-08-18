import type { HighlightOptions as TiptapHighlightOptions } from '@tiptap/extension-highlight'
import { Highlight as TiptapHighlight } from '@tiptap/extension-highlight'

import HighlightActionButton from './components/HighlightActionButton'
import type { GeneralOptions } from '@/types'

export interface HighlightOptions
  extends TiptapHighlightOptions,
  GeneralOptions<HighlightOptions> {}

export const Highlight = TiptapHighlight.extend<HighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button: ({ editor, t }) => ({
        component: HighlightActionButton,
        componentProps: {
          action: (color?: unknown) => {
            if (typeof color === 'string') {
              editor.chain().focus().setHighlight({ color }).run()
            }
            if (color === undefined) {
              editor.chain().focus().unsetHighlight().run()
            }
          },
          editor,
          isActive: () => editor.isActive('highlight') || false,
          disabled: !editor.can().setHighlight(),
          shortcutKeys: ['⇧', 'mod', 'H'],
          tooltip: t('editor.highlight.tooltip'),
        },
      }),
    }
  },
})
