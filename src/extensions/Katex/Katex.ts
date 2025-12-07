import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { KatexNodeView } from '@/extensions/Katex/components/KatexWrapper';

export * from '@/extensions/Katex/components/RichTextKatex';

export interface IKatexAttrs {
  text?: string
  defaultShowPicker?: boolean
}

interface IKatexOptions {
  HTMLAttributes: Record<string, any>
}

function getDatasetAttribute(attribute: string) {
  return (element: any) => {
    return element.getAttribute(attribute);
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    katex: {
      setKatex: (arg?: IKatexAttrs) => ReturnType
    }
  }
}

export const Katex = /* @__PURE__ */ Node.create<IKatexOptions>({
  name: 'katex',
  group: 'inline',
  inline: true,
  defining: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'katex',
      },
      button: ({ t }: any) => {
        return {
          componentProps: {
            action: () => {
              return true;
            },
            isActive: () => false,
            disabled: false,
            icon: 'KatexIcon',
            tooltip: t('editor.katex.tooltip'),
          },
        };
      },
    };
  },

  addAttributes() {
    return {
      text: {
        default: '',
        parseHTML: getDatasetAttribute('text'),
      },
      defaultShowPicker: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span.katex' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes)];
  },

  addCommands() {
    return {
      setKatex:
        options =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$katex\$$/,
        type: this.type,
        getAttributes: () => {
          return { defaultShowPicker: true };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KatexNodeView);
  },
});
