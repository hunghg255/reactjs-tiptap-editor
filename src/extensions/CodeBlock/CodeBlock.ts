export * from '@/extensions/CodeBlock/components/RichTextCodeBlock';
import CodeBlockRangi, {
  CodeBlockRangiOptions,
} from '@/extensions/CodeBlock/extension-code-block-rangi/src';
import { type GeneralOptions } from '@/types';

export interface CodeBlockOptions extends CodeBlockRangiOptions, GeneralOptions<CodeBlockOptions> {}

export const CodeBlock = CodeBlockRangi.extend<CodeBlockOptions>({
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: any) => {
        return {
          componentProps: {
            action: () => editor.chain().focus().setCodeBlock({ language: 'plaintext' }).run(),
            isActive: () => editor.isActive('codeBlock'),
            disabled: false,
            icon: 'Code2',
            tooltip: t('editor.codeblock.tooltip'),
          },
        };
      },
    };
  },
});
