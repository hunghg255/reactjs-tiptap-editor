import { mergeAttributes } from '@tiptap/core';
import type { ImageOptions } from '@tiptap/extension-image';
import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import ImageGifActionButton from '@/extensions/ImageGif/components/ImageGifActionButton';
import ImageGifView from '@/extensions/ImageGif/components/ImageGifView';

export interface SetImageAttrsOptions {
  src?: string
  /** The alternative text for the image. */
  alt?: string
  /** The title of the image. */
  title?: string
  /** The width of the image. */
  width?: number | string | null
  /** The alignment of the image. */
  align?: 'left' | 'center' | 'right'
}

interface ImageGifOptions extends ImageOptions {
  provider: 'giphy' | 'tenor'
  /**
   * The key for the gif https://giphy.com/ or https://tenor.com/
   */
  API_KEY: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGifUpload: {
      /**
       * Add an image gif
       */
      setImageGif: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image gif
       */
      updateImageGif: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Set image alignment
       */
      setAlignImageGif: (align: 'left' | 'center' | 'right') => ReturnType
    }
  }
}

export const ImageGif = /* @__PURE__ */ TiptapImage.extend<ImageGifOptions>({
  name: 'imageGif',
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      content: '',
      marks: '',
      group: 'block',
      API_KEY: '',
      provider: 'giphy',
      draggable: false,
      selectable: true,
      atom: true,
      button: ({ editor, extension, t }: any) => {
        const provider = extension?.options?.provider || '';
        const apiKey = extension?.options?.API_KEY || '';

        return {
          component: ImageGifActionButton,
          componentProps: {
            editor,
            action: () => {
              return;
            },
            isActive: () => false,
            disabled: false,
            icon: 'GifIcon',
            tooltip: t('editor.imageGif.tooltip'),
            apiKey,
            provider
          },
        };
      },
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.style.width || element.getAttribute('width') || '10';
          return width === undefined ? null : Number.parseInt(`${width}`, 10);
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
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
    return ReactNodeViewRenderer(ImageGifView);
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImageGif: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
      updateImageGif:
        (options: any) =>
          ({ commands }: any) => {
            return commands.updateAttributes(this.name, options);
          },
      setAlignImageGif:
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
        class: 'imageGIf',
      },
      [
        'img',
        mergeAttributes(
          // Always render the `height="auto"`
          {
            height: 'auto',
          },
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
      ],
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div[class=imageGIf]',
        getAttrs: (element) => {
          const img = element.querySelector('img');

          const width = img?.getAttribute('width');

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            title: img?.getAttribute('title'),
            width: width ? Number.parseInt(width, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
          };
        },
      },
    ];
  },
});

export default ImageGif;
