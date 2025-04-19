import { Extension } from '@tiptap/core';

import type { GeneralOptions } from '@/types';

import TextDropdown from './components/TextDropdown';

export interface TextBubbleOptions extends GeneralOptions<TextBubbleOptions> {}

export const TextBubble = /* @__PURE__ */ Extension.create<TextBubbleOptions>({
  name: 'text-bubble',
  addOptions() {
    return {
      ...this.parent?.(),
      toolbar: false,
      button: () => ({
        component: TextDropdown,
        componentProps: {},
      }),
    };
  },
});

export default TextBubble;
