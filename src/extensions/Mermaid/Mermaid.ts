import { mergeAttributes } from '@tiptap/core';
import TiptapImage, { type ImageOptions as TiptapImageOptions } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { NodeViewMermaid } from '@/extensions/Mermaid/components/NodeViewMermaid/NodeViewMermaid';

import type { ButtonViewParams } from '@/types';
import type { GeneralOptions } from '@/types';
import type { CommandProps } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mermaid: {
      setMermaid: (
        options: { src: string; alt?: string; type?: string; width?: number; height?: number },
        replace?: boolean
      ) => ReturnType;
      setAlignImageMermaid: (align: 'left' | 'center' | 'right') => ReturnType;
    };
  }
}

export * from '@/extensions/Mermaid/components/RichTextMermaid';

export interface MermaidOptions extends TiptapImageOptions, GeneralOptions<MermaidOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>;
}

export const Mermaid = /* @__PURE__ */ TiptapImage.extend<MermaidOptions>({
  name: 'mermaid',

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      content: '',
      marks: '',
      group: 'block',
      draggable: false,
      selectable: true,
      atom: true,
      HTMLAttributes: {
        class: 'mermaid',
      },
      button: ({ editor, t, extension }: ButtonViewParams<MermaidOptions>) => ({
        componentProps: {
          action: () => {
            return true;
          },
          isActive: () => false,
          disabled: false,
          editor,
          icon: 'Mermaid',
          tooltip: t('editor.mermaid.tooltip'),
          upload: extension?.options?.upload,
        },
      }),
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const img = element.querySelector('img');

          const width = img?.getAttribute('width');

          return width ? Number.parseInt(width, 10) : 320;
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const img = element.querySelector('img');

          const height = img?.getAttribute('height');

          return height ? Number.parseInt(height, 10) : 212;
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('align'),
        renderHTML: (attributes) => {
          return {
            align: attributes.align,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewMermaid);
  },

  addCommands() {
    return {
      setMermaid:
        (
          options: { src: string; alt?: string; type?: string; width?: number; height?: number },
          replace?: boolean
        ) =>
        ({ commands, editor }: CommandProps) => {
          if (replace) {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          }
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: options,
          });
        },

      setAlignImageMermaid:
        (align: 'left' | 'center' | 'right') =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { align } = HTMLAttributes;

    const style = align ? `text-align: ${align};` : '';
    return [
      'div', // Parent element
      {
        style,
        class: 'imageMermaid',
      },
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div[class=imageMermaid]',
        getAttrs: (element) => {
          const img = element.querySelector('img');

          const width = img?.getAttribute('width');
          const height = img?.getAttribute('height');

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            width: width ? Number.parseInt(width, 10) : null,
            height: height ? Number.parseInt(height, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
          };
        },
      },
    ];
  },
});
