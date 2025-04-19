import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import KatexActiveButton from '@/extensions/Katex/components/KatexActiveButton';
import { KatexWrapper } from '@/extensions/Katex/components/KatexWrapper';

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
      button: ({ editor, t }: any) => {
        return {
          component: KatexActiveButton,
          componentProps: {
            editor,
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
    return ReactNodeViewRenderer(KatexWrapper);
  },
});
