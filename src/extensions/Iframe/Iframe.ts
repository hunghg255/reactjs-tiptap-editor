/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ActionButton } from '@/components';
import IframeNodeView from '@/extensions/Iframe/components/IframeNodeView';
import { getDatasetAttribute } from '@/utils/dom-dataset';

export interface IIframeAttrs {
  width?: number | string
  height?: number
  src?: string
  defaultShowPicker?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string, service: string }) => ReturnType
    }
  }
}

export const Iframe = /* @__PURE__ */ Node.create({
  name: 'iframe',
  content: '',
  marks: '',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'iframe',
      },
      button: ({
        editor,
        extension,
        t,
      }: {
        editor: any
        extension: any
        t: (key: string) => string
      }) => ({
        component: ActionButton,
        componentProps: {
          action: (options: { src: string, service: string }) => editor.commands.setIframe(options),
          upload: extension.options.upload,
          disabled: !editor.can().setIframe({}),
          icon: 'Iframe',
          tooltip: t('editor.iframe.tooltip'),
        },
      }),
    };
  },

  addAttributes() {
    return {
      width: {
        default: 600,
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 300,
        parseHTML: getDatasetAttribute('height'),
      },
      src: {
        default: null,
        parseHTML: getDatasetAttribute('src'),
      },
      defaultShowPicker: {
        default: false,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setIframe:
        options =>
          ({ tr, commands, chain }) => {
          // @ts-ignore
            if (tr.selection?.node?.type?.name == this.name) {
              return commands.updateAttributes(this.name, options);
            }

            const attrs = options || { url: '' };
            // const { selection } = editor.state

            return chain()
              .insertContent({
                type: this.name,
                attrs,
              })
              .run();
          },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$iframe\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: '100%' };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframeNodeView);
  },
});
