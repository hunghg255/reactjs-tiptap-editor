import type { CodeOptions as TiptapCodeOptions } from '@tiptap/extension-code';
import { Code as TiptapCode } from '@tiptap/extension-code';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextCode';

export interface CodeOptions extends TiptapCodeOptions, GeneralOptions<CodeOptions> {}

export const Code = /* @__PURE__ */ TiptapCode.extend<CodeOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }) => ({
        componentProps: {
          action: () => editor.commands.toggleCode(),
          isActive: () => editor.isActive('code'),
          disabled: !editor.can().toggleCode(),
          icon: 'Code',
          shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'E'],
          tooltip: t('editor.code.tooltip'),
        },
      }),
    };
  },
});
