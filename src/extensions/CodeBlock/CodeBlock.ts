import { mergeAttributes, Node } from '@tiptap/core';
import { textblockTypeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import CodeBlockActiveButton from '@/extensions/CodeBlock/components/CodeBlockActiveButton';
import { NodeViewCodeBlock } from '@/extensions/CodeBlock/components/NodeViewCodeBlock/NodeViewCodeBlock';
import { type GeneralOptions } from '@/types';

export interface CodeBlockOptions extends GeneralOptions<CodeBlockOptions> { }

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setCodeBlock: {
      setCodeBlock: (options?: any) => ReturnType
    }
  }
}

/**
 * Matches a code block with backticks.
 */
export const backtickInputRegex = /^`{3}([a-z]+)?\s$/;

/**
 * Matches a code block with tildes.
 */
export const tildeInputRegex = /^~{3}([a-z]+)?\s$/;

export const CodeBlock = /* @__PURE__ */ Node.create({
  name: 'codeBlock',
  group: 'block',
  atom: true,
  content: 'text*',
  addOptions() {
    return {
      ...this.parent?.(),
      languages: [],
      button: ({ editor, t }: any) => {
        return {
          component: CodeBlockActiveButton,
          componentProps: {
            action: () => editor.commands.setCodeBlock({}),
            isActive: () => editor.isActive('codeBlock') || false,
            disabled: false,
            icon: 'Code2',
            tooltip: t('editor.codeblock.tooltip'),
          },
        };
      },
    };
  },
  addAttributes() {
    return {
      code: {
        default: '',
        parseHTML: (element) => {
          return element.textContent || '';
        }
      },
      language: {
        default: 'plaintext',
      },
      lineNumbers: {
        default: true,
      },
      wordWrap: {
        default: false,
      },
      tabSize: {
        default: 2
      },
      shouldFocus: {
        default: true,
        parseHTML: () => false,
        renderHTML: false
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node: HTMLElement) => {
          return {
            code: node.textContent || ''
          };
        }
      },
      {
        tag: 'pre code',
        preserveWhitespace: 'full',
        getAttrs: (node: HTMLElement) => {
          return {
            code: node.textContent || ''
          };
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    const code = node.attrs.code || node.content.firstChild?.text || '';
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['code', {}, code]
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(NodeViewCodeBlock);
  },
  addCommands() {
    return {
      setCodeBlock:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                ...options,
                shouldFocus: true
              },
            });
          },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.setCodeBlock({}),
    };
  },
  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
        getAttributes: match => ({
          language: match[1],
        }),
      }),
      textblockTypeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: match => ({
          language: match[1],
        }),
      }),
    ];
  },
});
