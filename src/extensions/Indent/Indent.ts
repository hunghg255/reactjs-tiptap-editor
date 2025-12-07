import { Extension } from '@tiptap/core';

import type { GeneralOptions } from '@/types';
import { IndentProps, createIndentCommand } from '@/utils/indent';

export * from './components/RichTextIndent';

export interface IndentOptions extends GeneralOptions<IndentOptions> {
  types: string[]
  minIndent: number
  maxIndent: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Set the indent attribute
       */
      indent: () => ReturnType
      /**
       * Set the outdent attribute
       */
      outdent: () => ReturnType
    }
  }
}

export const Indent = /* @__PURE__ */ Extension.create<IndentOptions>({
  name: 'richtextIndentOutdent',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['paragraph', 'heading', 'blockquote'],
      minIndent: IndentProps.min,
      maxIndent: IndentProps.max,
      button({ editor, t, extension }) {
        return {
          componentProps: {
            indent: {
              action: () => {
                editor.commands.indent();
              },
              shortcutKeys: extension.options.shortcutKeys?.[0] ?? ['Tab'],
              icon: 'IndentIncrease',
              tooltip: t('editor.indent.tooltip'),
            },
            outdent: {
              action: () => {
                editor.commands.outdent();
              },
              shortcutKeys: extension.options.shortcutKeys?.[1] ?? ['Shift', 'Tab'],
              icon: 'IndentDecrease',
              tooltip: t('editor.outdent.tooltip')
            }
          }
        };
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const identAttr = element.dataset.indent;
              return (identAttr ? Number.parseInt(identAttr, 10) : 0) || 0;
            },
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {};
              }
              return { 'data-indent': attributes.indent };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () =>
        createIndentCommand({
          delta: IndentProps.more,
          types: this.options.types,
        }),
      outdent: () =>
        createIndentCommand({
          delta: IndentProps.less,
          types: this.options.types,
        }),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Tab': () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    };
  },
});
