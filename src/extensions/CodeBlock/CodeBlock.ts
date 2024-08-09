/* eslint-disable unicorn/no-null */
import { CodeBlockLowlight as TiptapCodeBlock } from '@tiptap/extension-code-block-lowlight';
import type { CodeBlockLowlightOptions as TiptapCodeBlockOptions } from '@tiptap/extension-code-block-lowlight';

import ActionButton from '@/components/ActionButton';
import type { GeneralOptions } from '@/types';

export interface CodeBlockOptions
  extends TiptapCodeBlockOptions,
    GeneralOptions<CodeBlockOptions> {}

export const CodeBlock = TiptapCodeBlock.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: null,
      button: ({ editor, t }: any) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleCodeBlock(),
          isActive: () => editor.isActive('codeBlock') || false,
          disabled: !editor.can().toggleCodeBlock(),
          icon: 'Code2',
          tooltip: t('editor.codeblock.tooltip'),
        },
      }),
    };
  },
});
