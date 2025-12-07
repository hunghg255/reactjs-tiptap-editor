// import type { OrderedListOptions as TiptapOrderedListOptions } from '@tiptap/extension-ordered-list';
// import { OrderedList as TiptapOrderedList } from '@tiptap/extension-ordered-list';
import { OrderedList as TiptapOrderedList, type OrderedListOptions as  TiptapOrderedListOptions } from '@tiptap/extension-list';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextOrderedList';

export interface OrderedListOptions
  extends TiptapOrderedListOptions,
  GeneralOptions<OrderedListOptions> {}

export const OrderedList = /* @__PURE__ */ TiptapOrderedList.extend<OrderedListOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }) => ({
        componentProps: {
          action: () => editor.commands.toggleOrderedList(),
          isActive: () => editor.isActive('orderedList'),
          disabled: false,
          icon: 'ListOrdered',
          shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'shift', '7'],
          tooltip: t('editor.orderedlist.tooltip'),
        },
      }),
    };
  },
});
