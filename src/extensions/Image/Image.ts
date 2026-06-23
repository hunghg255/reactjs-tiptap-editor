import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import ImageView from '@/extensions/Image/components/ImageView';

import type { GeneralOptions, JSONContent } from '@/types';

export * from '@/extensions/Image/components/RichTextImage';

export const IMAGE_BLOCK_NAME = 'imageBlock';

export interface SetImageAttrsOptions {
  src?: string;
  /** The alternative text for the image. */
  alt?: string;
  /** The caption of the image. */
  caption?: string;
  /** The width of the image. */
  width?: number | string | null;
  /** The alignment of the image. */
  align?: 'left' | 'center' | 'right';
  /** Whether the image is inline. */
  inline?: boolean;
  /** image FlipX */
  flipX?: boolean;
  /** image FlipY */
  flipY?: boolean;
}

export const DEFAULT_OPTIONS: any = {
  acceptMimes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
  maxSize: 1024 * 1024 * 5, // 5MB
  multiple: true,
  resourceImage: 'both',
  defaultInline: false,
  enableAlt: true,
};

function parseBooleanHTMLAttribute(value: string | boolean | null | undefined): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }

  return value === true || value === '' || value === 'true';
}

function getBooleanHTMLAttribute(value: string | boolean | null | undefined): boolean {
  return parseBooleanHTMLAttribute(value) ?? false;
}

function getImageElement(element: HTMLElement): HTMLImageElement | null {
  if (element.matches('img')) {
    return element as HTMLImageElement;
  }

  return element.querySelector('img');
}

function getImageAttrsFromElement(element: HTMLElement, inlineFallback = false) {
  const img = getImageElement(element);

  if (!img) {
    return false;
  }

  const width = img.style.width || img.getAttribute('width');
  const flipX = img.getAttribute('flipx') || false;
  const flipY = img.getAttribute('flipy') || false;
  const inline = parseBooleanHTMLAttribute(img.getAttribute('inline')) ?? inlineFallback;

  return {
    src: img.getAttribute('src'),
    alt: img.getAttribute('alt'),
    caption: img.getAttribute('caption'),
    width: width ? Number.parseInt(width, 10) : null,
    align: img.getAttribute('align') || element.style.textAlign || null,
    inline,
    flipX: flipX === 'true',
    flipY: flipY === 'true',
  };
}

function getTransformStyle(flipX: boolean, flipY: boolean): string {
  return flipX || flipY
    ? `transform: rotateX(${flipX ? '180' : '0'}deg) rotateY(${flipY ? '180' : '0'}deg);`
    : '';
}

function getActiveImageNodeName(state: any, fallbackName: string): string {
  const selectedNodeName = state.selection?.node?.type?.name;

  if (selectedNodeName === IMAGE_BLOCK_NAME) {
    return IMAGE_BLOCK_NAME;
  }

  return fallbackName;
}

function getImageInsertNodeName(state: any, inline: boolean, fallbackName: string): string {
  if (!inline && state.schema.nodes[IMAGE_BLOCK_NAME]) {
    return IMAGE_BLOCK_NAME;
  }

  return fallbackName;
}

function isInlineJSONImage(node: JSONContent): boolean {
  return parseBooleanHTMLAttribute(node.attrs?.inline) === true;
}

function isLegacyBlockImageJSON(node: JSONContent): boolean {
  return node.type === 'image' && !isInlineJSONImage(node);
}

function toImageBlockJSON(node: JSONContent): JSONContent {
  const { inline: _inline, ...attrs } = node.attrs ?? {};

  return {
    type: IMAGE_BLOCK_NAME,
    attrs: {
      ...attrs,
      inline: false,
    },
  };
}

/**
 * Converts old JSON documents that stored block images as paragraph-wrapped `image`
 * inline nodes into the new `imageBlock` node. The original `image` node remains
 * supported, so using this helper is optional and can be done during persistence migration.
 */
export function migrateImageJSONToImageBlock(content: JSONContent): JSONContent {
  const nextContent = content.content?.map((node) => migrateImageJSONToImageBlock(node));

  if (content.type === 'paragraph' && content.content?.length === 1) {
    const onlyChild = content.content[0];

    if (onlyChild && isLegacyBlockImageJSON(onlyChild)) {
      return toImageBlockJSON(onlyChild);
    }
  }

  return {
    ...content,
    ...(nextContent ? { content: nextContent } : {}),
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      /**
       * Add an image
       */
      setImageInline: (options: Partial<SetImageAttrsOptions>) => ReturnType;
      /**
       * Add a block image
       */
      setImageBlock: (options: Partial<SetImageAttrsOptions>) => ReturnType;
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType;
      /**
       * Set image alignment
       */
      setAlignImage: (align: 'left' | 'center' | 'right') => ReturnType;
    };
  }
}

export interface IImageOptions extends GeneralOptions<IImageOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>;

  HTMLAttributes?: any;

  multiple?: boolean;
  acceptMimes?: string[];
  maxSize?: number;

  /** The source URL of the image */
  resourceImage: 'upload' | 'link' | 'both';
  defaultInline?: boolean;

  // Enable alternative text input
  enableAlt?: boolean;

  /** Function to handle errors during file validation */
  onError?: (error: { type: 'size' | 'type' | 'upload'; message: string; file?: File }) => void;
}

function getImageOptions(extension: any) {
  return {
    ...DEFAULT_OPTIONS,
    ...extension.parent?.(),
    upload: () => Promise.reject('Image Upload Function'),
  };
}

export const ImageBlock = /* @__PURE__ */ TiptapImage.extend<IImageOptions>({
  name: IMAGE_BLOCK_NAME,
  group: 'block',
  inline: false,
  defining: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return getImageOptions(this);
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      flipX: {
        default: false,
        renderHTML: (attributes) => {
          return {
            flipx: attributes.flipX ? 'true' : null,
          };
        },
      },
      flipY: {
        default: false,
        renderHTML: (attributes) => {
          return {
            flipy: attributes.flipY ? 'true' : null,
          };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.style.width || element.getAttribute('width') || null;
          return !width ? null : Number.parseInt(width, 10);
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
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
      inline: {
        default: false,
        parseHTML: () => false,
        renderHTML: () => {
          return {
            inline: null,
          };
        },
      },
      alt: {
        default: '',
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          return {
            alt: attributes.alt,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
  renderHTML({ HTMLAttributes }) {
    const { flipX, flipY, align } = HTMLAttributes;
    const transformStyle = getTransformStyle(flipX, flipY);
    const wrapperStyle = align ? `text-align: ${align};` : null;
    const imageHTMLAttributes = {
      ...HTMLAttributes,
      inline: null,
    };

    return [
      'div',
      {
        class: 'image',
        style: wrapperStyle,
      },
      [
        'img',
        mergeAttributes(
          {
            height: 'auto',
            style: transformStyle || null,
          },
          this.options.HTMLAttributes,
          imageHTMLAttributes
        ),
      ],
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div[class=image]',
        getAttrs: (element) => {
          const attrs = getImageAttrsFromElement(element as HTMLElement, false);

          if (!attrs) {
            return false;
          }

          return {
            ...attrs,
            inline: false,
          };
        },
      },
      {
        tag: 'span.image',
        getAttrs: (element) => {
          const attrs = getImageAttrsFromElement(element as HTMLElement, false);

          if (!attrs || attrs.inline) {
            return false;
          }

          return {
            ...attrs,
            inline: false,
          };
        },
      },
      {
        tag: (this.options as any).allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
        getAttrs: (element) => {
          const attrs = getImageAttrsFromElement(element as HTMLElement, false);

          if (!attrs || attrs.inline) {
            return false;
          }

          return {
            ...attrs,
            inline: false,
          };
        },
      },
    ];
  },
});

export const Image = /* @__PURE__ */ TiptapImage.extend<IImageOptions>({
  group: 'inline',
  inline: true,
  defining: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      ...getImageOptions(this),
      button: ({
        editor,
        extension,
        t,
      }: {
        editor: any;
        extension: any;
        t: (key: string) => string;
      }) => ({
        componentProps: {
          action: () => {
            return true;
          },
          upload: extension.options.upload,
          /* If setImageInline is not available(when Image Component is not imported), the button is disabled */
          disabled: !editor.can().setImageInline?.({}),
          icon: 'ImageUp',
          tooltip: t('editor.image.tooltip'),
        },
      }),
    };
  },
  addExtensions() {
    return [ImageBlock.configure(this.options)];
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      flipX: {
        default: false,
        renderHTML: (attributes) => {
          return {
            flipx: attributes.flipX ? 'true' : null,
          };
        },
      },
      flipY: {
        default: false,
        renderHTML: (attributes) => {
          return {
            flipy: attributes.flipY ? 'true' : null,
          };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.style.width || element.getAttribute('width') || null;
          return !width ? null : Number.parseInt(width, 10);
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
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
      inline: {
        default: false,
        parseHTML: (element) => parseBooleanHTMLAttribute(element.getAttribute('inline')),
        renderHTML: (attributes) => {
          return {
            inline: attributes.inline ? 'true' : null,
          };
        },
      },
      alt: {
        default: '',
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          return {
            alt: attributes.alt,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImageInline:
        (options: any) =>
        ({ commands, state }: any) => {
          const inline = options.inline ?? this.options.defaultInline;
          const nodeName = getImageInsertNodeName(state, inline, this.name);

          return commands.insertContent({
            type: nodeName,
            attrs: {
              ...options,
              inline,
            },
          });
        },
      setImageBlock:
        (options: any) =>
        ({ commands, state }: any) => {
          const nodeName = getImageInsertNodeName(state, false, this.name);

          return commands.insertContent({
            type: nodeName,
            attrs: {
              ...options,
              inline: false,
            },
          });
        },
      updateImage:
        (options) =>
        ({ commands, state }) => {
          const nodeName = getActiveImageNodeName(state, this.name);
          return commands.updateAttributes(nodeName, options);
        },
      setAlignImage:
        (align) =>
        ({ commands, state }) => {
          const nodeName = getActiveImageNodeName(state, this.name);
          return commands.updateAttributes(nodeName, { align });
        },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { flipX, flipY, align, inline } = HTMLAttributes;
    const isInline = getBooleanHTMLAttribute(inline);
    const inlineFloat = isInline && (align === 'left' || align === 'right');

    const transformStyle = getTransformStyle(flipX, flipY);

    const textAlignStyle =
      !isInline && align === 'center'
        ? 'margin: 0 auto;'
        : !isInline && align === 'right'
          ? 'margin-left: auto;'
          : !isInline
            ? 'margin-right: auto;'
            : '';

    const displayStyle = isInline ? '' : 'display: block;';

    const floatStyle = inlineFloat ? `float: ${align};` : '';

    const marginStyle = inlineFloat
      ? align === 'left'
        ? 'margin: 1em 1em 1em 0;'
        : 'margin: 1em 0 1em 1em;'
      : '';

    const style = `${displayStyle}${textAlignStyle}${floatStyle}${marginStyle}${transformStyle}`;
    const imageHTMLAttributes = {
      ...HTMLAttributes,
      inline: isInline ? 'true' : null,
    };

    return [
      'span',
      {
        class: 'image',
      },
      [
        'img',
        mergeAttributes(
          {
            height: 'auto',
            style: style || null,
          },
          this.options.HTMLAttributes,
          imageHTMLAttributes
        ),
      ],
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'span.image',
        getAttrs: (element) => {
          const attrs = getImageAttrsFromElement(element as HTMLElement, false);

          if (!attrs || !attrs.inline) {
            return false;
          }

          return attrs;
        },
      },
      {
        tag: (this.options as any).allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
        getAttrs: (element) => {
          const attrs = getImageAttrsFromElement(element as HTMLElement, false);

          if (!attrs || !attrs.inline) {
            return false;
          }

          return attrs;
        },
      },
    ];
  },

  // addProseMirrorPlugins() {
  //   const validateFile = (file: File): boolean => {
  //     // @ts-expect-error
  //     if (!this.options.acceptMimes.includes(file.type)) {
  //       // toast({ description: t.value('editor.imageUpload.fileTypeNotSupported'), duration: 2000 });
  //       return false;
  //     }
  //     // @ts-expect-error
  //     if (file.size > this.options.maxSize) {
  //       // toast({
  //       //   description: `${t.value('editor.imageUpload.fileSizeTooBig')} ${formatFileSize(
  //       //     this.options.maxSize,
  //       //   )}.`,
  //       //   duration: 2000,
  //       // });
  //       return false;
  //     }
  //     return true;
  //   };

  //   const uploadFn = createImageUpload({
  //     validateFn: validateFile,
  //     onUpload: this.options.upload as any,
  //     // postUpload: this.options.postUpload,
  //     defaultInline: this.options.defaultInline,
  //   });

  //   return [
  //     UploadImagesPlugin(),

  //     new Plugin({
  //       key: new PluginKey(`richtextCustomPlugin${this.name}`),
  //       props: {
  //         handlePaste: (view, event) => {
  //           const hasFiles =
  //               event.clipboardData &&
  //               event.clipboardData.files &&
  //               event.clipboardData.files?.length;

  //           if (!hasFiles) {
  //             return;
  //           }

  //           const items = [...(event.clipboardData.files || [])];

  //           if (items.some(x => x.type === 'text/html')) {
  //             return false;
  //           }

  //           return handleImagePaste(view, event, uploadFn);
  //         },
  //         handleDrop: (view, event, _, moved) => {
  //           if (!(event instanceof DragEvent) || !event.dataTransfer) {
  //             return false;
  //           }

  //           handleImageDrop(view, event, moved, uploadFn);
  //           return false;
  //         },
  //       },
  //     }),
  //   ];
  // },
});
