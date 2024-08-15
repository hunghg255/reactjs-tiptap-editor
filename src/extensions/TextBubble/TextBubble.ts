import { Extension } from '@tiptap/core'

import TextDropdown from './components/TextDropdown'
import type { GeneralOptions } from '@/types'

export interface TextBubbleOptions extends GeneralOptions<TextBubbleOptions> {}

export const TextBubble = Extension.create<TextBubbleOptions>({
  name: 'text-bubble',
  addOptions() {
    return {
      ...this.parent?.(),
      toolbar: false,
      button: () => ({
        component: TextDropdown,
        componentProps: {},
      }),
    }
  },
})

export default TextBubble
