import { Node } from '@tiptap/core';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

export interface ClearOptions extends GeneralOptions<ClearOptions> {}

export const Clear = /* @__PURE__ */ Node.create<ClearOptions>({
  name: 'clear',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
          disabled: !editor.can().chain().focus().clearNodes().unsetAllMarks().run(),
          icon: 'Eraser',
          tooltip: t('editor.clear.tooltip'),
        },
      }),
    };
  },
});
