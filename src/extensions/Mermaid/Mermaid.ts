/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { CommandProps } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { MermaidActiveButton } from '@/extensions/Mermaid/components/MermaidActiveButton';
import { NodeViewMermaid } from '@/extensions/Mermaid/components/NodeViewMermaid/NodeViewMermaid';
import type { GeneralOptions } from '@/types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mermaid: {
      setMermaid: (options: any, replace?: any) => ReturnType
      setAlignImageMermaid: (align: 'left' | 'center' | 'right') => ReturnType
    }
  }
}

export interface MermaidOptions extends GeneralOptions<MermaidOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>
}

export const Mermaid = /* @__PURE__ */ TiptapImage.extend<MermaidOptions>({
  name: 'mermaid',

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
      button: ({ editor, t, extension }: any) => ({
        component: MermaidActiveButton,
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
          const img = element.querySelector('img') as any;

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
          const img = element.querySelector('img') as any;

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
        parseHTML: element => element.getAttribute('align'),
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

  // @ts-ignore
  addCommands() {
    return {
      setMermaid:
          (
            options: { src: string, alt?: string },
            replace?: boolean,
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
            (align: any) =>
              ({ commands }: any) => {
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
      [
        'img',
        mergeAttributes(
          // @ts-ignore
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
      ],
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
