import { mergeAttributes } from '@tiptap/core';
import TiptapImage, { type ImageOptions as TiptapImageOptions } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { NodeViewDrawer } from '@/extensions/Drawer/components/NodeViewDrawer/NodeViewDrawer';

import type { ButtonViewParams } from '@/types';
import type { GeneralOptions } from '@/types';
import type { CommandProps } from '@tiptap/core';

export * from '@/extensions/Drawer/components/RichTextDrawer';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    drawer: {
      setDrawer: (
        options: { src: string; alt?: string; type?: string; width?: number; height?: number },
        replace?: boolean
      ) => ReturnType;
      setAlignImageDrawer: (align: 'left' | 'center' | 'right') => ReturnType;
    };
  }
}

export interface DrawerOptions extends TiptapImageOptions, GeneralOptions<DrawerOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>;
}

export const Drawer = /* @__PURE__ */ TiptapImage.extend<DrawerOptions>({
  name: 'richTextDrawer',

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
        class: 'drawer',
      },
      button: ({ t, extension }: ButtonViewParams<DrawerOptions>) => ({
        componentProps: {
          action: () => {
            return true;
          },
          isActive: () => false,
          disabled: false,
          icon: 'PencilRuler',
          tooltip: t('editor.drawer.tooltip'),
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
    return ReactNodeViewRenderer(NodeViewDrawer);
  },

  addCommands() {
    return {
      setDrawer:
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

      setAlignImageDrawer:
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
        class: 'imageDrawer',
      },
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div[class=imageDrawer]',
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
