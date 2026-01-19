import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ActionButton } from '@/components';
import { NodeViewCallout } from '@/extensions/Callout/components/NodeViewCallout/NodeViewCallout';
import type { GeneralOptions } from '@/types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { type?: string; title?: string; body?: string }) => ReturnType;
    };
  }
}

export interface CalloutOptions extends GeneralOptions<CalloutOptions> {
  HTMLAttributes: Record<string, any>;
}

function getDatasetAttribute(attribute: string) {
  return (element: any) => {
    return element.getAttribute(attribute);
  };
}

export * from './components/RichTextCallout';

export const Callout = /* @__PURE__ */ Node.create<CalloutOptions>({
  name: 'callout',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,
  inline: false,

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'callout',
      },
      button: ({ editor, t }: any) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            return true;
          },
          isActive: () => editor.isActive('callout'),
          disabled: false,
          icon: 'Callout',
          tooltip: t('editor.callout.tooltip'),
        },
      }),
    };
  },

  parseHTML() {
    return [{ tag: 'div.callout' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes),
    ];
  },

  addAttributes() {
    return {
      type: {
        default: '',
        parseHTML: getDatasetAttribute('type'),
      },
      title: {
        default: '',
        parseHTML: getDatasetAttribute('title'),
      },
      body: {
        default: '',
        parseHTML: getDatasetAttribute('body'),
      },
    };
  },

  addCommands() {
    return {
      setCallout:
        (options) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewCallout);
  },
});
