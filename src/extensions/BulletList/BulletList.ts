// import type { BulletListOptions as TiptapBulletListOptions } from '@tiptap/extension-bullet-list';
// import { BulletList as TiptapBulletList } from '@tiptap/extension-bullet-list';
import { BulletList as TiptapBulletList, type BulletListOptions as  TiptapBulletListOptions } from '@tiptap/extension-list';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextBulletList';

export interface BulletListOptions
  extends TiptapBulletListOptions,
  GeneralOptions<BulletListOptions> {}

export const BulletList = /* @__PURE__ */ TiptapBulletList.extend<BulletListOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }) => ({
        // component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleBulletList(),
          isActive: () => editor.isActive('bulletList'),
          disabled: false,
          shortcutKeys: extension.options.shortcutKeys ?? ['shift', 'mod', '8'],
          icon: 'List',
          tooltip: t('editor.bulletlist.tooltip'),
        },
      }),
    };
  },
});
