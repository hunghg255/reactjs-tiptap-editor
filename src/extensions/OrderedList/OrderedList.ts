import type { OrderedListOptions as TiptapOrderedListOptions } from '@tiptap/extension-ordered-list';
import { OrderedList as TiptapOrderedList } from '@tiptap/extension-ordered-list';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

export interface OrderedListOptions
  extends TiptapOrderedListOptions,
  GeneralOptions<OrderedListOptions> {}

export const OrderedList = /* @__PURE__ */ TiptapOrderedList.extend<OrderedListOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleOrderedList(),
          isActive: () => editor.isActive('orderedList') || false,
          disabled: false,
          icon: 'ListOrdered',
          shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'shift', '7'],
          tooltip: t('editor.orderedlist.tooltip'),
        },
      }),
    };
  },
});
