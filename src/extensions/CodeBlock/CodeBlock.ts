import type { BundledLanguage, BundledTheme } from 'shiki'
import type { CodeBlockOptions as CodeBlockExtOptions } from '@tiptap/extension-code-block'
import CodeBlockExt from '@tiptap/extension-code-block'
import { ReactNodeViewRenderer } from '@tiptap/react'
import type { GeneralOptions } from '@/types'
import { ShikiPlugin } from '@/extensions/CodeBlock/shiki-plugin'
import CodeBlockActiveButton from '@/extensions/CodeBlock/components/CodeBlockActiveButton'
import { DEFAULT_LANGUAGE_CODE_BLOCK } from '@/constants'
import { NodeViewCodeBlock } from '@/extensions/CodeBlock/components/NodeViewCodeBlock/NodeViewCodeBlock'

export interface CodeBlockOptions
  extends GeneralOptions<CodeBlockExtOptions> {
  languages?: BundledLanguage[]
  defaultTheme: BundledTheme
}

export const CodeBlock = CodeBlockExt.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      languages: [],
      button: ({ editor, t, extension }: any) => {
        const languages = extension?.options?.languages?.length ? extension?.options?.languages : DEFAULT_LANGUAGE_CODE_BLOCK

        return {
          component: CodeBlockActiveButton,
          componentProps: {
            action: (language = 'js') => editor.commands.setCodeBlock({
              language,
            }),
            isActive: () => editor.isActive('codeBlock') || false,
            disabled: !editor.can().toggleCodeBlock(),
            icon: 'Code2',
            tooltip: t('editor.codeblock.tooltip'),
            languages,
          },
        }
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(NodeViewCodeBlock)
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      ShikiPlugin({
        name: this.name,
        defaultLanguage: null,
        defaultTheme: this.options.defaultTheme,
      }),
    ]
  },
})
