/* eslint-disable prefer-promise-reject-errors */
import { mergeAttributes } from '@tiptap/core'
import TiptapImage from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { Plugin } from '@tiptap/pm/state'
import ImageView from '@/extensions/Image/components/ImageView'
import ActionImageButton from '@/extensions/Image/components/ActionImageButton'
import type { GeneralOptions } from '@/types'
import { UploadImagesPlugin, createImageUpload, handleImageDrop, handleImagePaste } from '@/plugins/image-upload'

export interface SetImageAttrsOptions {
  src?: string
  /** The alternative text for the image. */
  alt?: string
  /** The caption of the image. */
  caption?: string
  /** The width of the image. */
  width?: number | string | null
  /** The alignment of the image. */
  align?: 'left' | 'center' | 'right'
  /** Whether the image is inline. */
  inline?: boolean
  /** image FlipX */
  flipX?: boolean
  /** image FlipY */
  flipY?: boolean
}

const DEFAULT_OPTIONS: any = {
  acceptMimes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
  maxSize: 1024 * 1024 * 5, // 5MB
  resourceImage: 'both',
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      /**
       * Add an image
       */
      setImageInline: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Set image alignment
       */
      setAlignImage: (align: 'left' | 'center' | 'right') => ReturnType
    }
  }
}

export interface IImageOptions extends GeneralOptions<IImageOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>

  HTMLAttributes?: any

  acceptMimes?: string[]
  maxSize?: number

  /** The source URL of the image */
  resourceImage: 'upload' | 'link' | 'both'
}

export const Image = TiptapImage.extend<IImageOptions>({
  group: 'inline',
  inline: true,
  defining: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      ...DEFAULT_OPTIONS,
      ...this.parent?.(),
      upload: () => Promise.reject('Image Upload Function'),
      button: ({
        editor,
        extension,
        t,
      }: {
        editor: any
        extension: any
        t: (key: string) => string
      }) => ({
        component: ActionImageButton,
        componentProps: {
          action: () => {},
          upload: extension.options.upload,
          /* If setImage is not available(when Image Component is not imported), the button is disabled */
          disabled: !editor.can().setImage?.({}),
          icon: 'ImageUp',
          tooltip: t('editor.image.tooltip'),
          editor,
        },
      }),
    }
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      flipX: {
        default: false,
      },
      flipY: {
        default: false,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.style.width || element.getAttribute('width') || null
          return !width ? null : Number.parseInt(width, 10)
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          }
        },
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('align'),
        renderHTML: (attributes) => {
          return {
            align: attributes.align,
          }
        },
      },
      inline: {
        default: false,
        parseHTML: element => Boolean(element.getAttribute('inline')),
        renderHTML: (attributes) => {
          return {
            inline: attributes.inline,
          }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImageInline: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
      updateImage:
        options =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, options)
          },
      setAlignImage:
          align =>
            ({ commands }) => {
              return commands.updateAttributes(this.name, { align })
            },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { flipX, flipY, align, inline } = HTMLAttributes

    const transformStyle
      = flipX || flipY ? `transform: rotateX(${flipX ? '180' : '0'}deg) rotateY(${flipY ? '180' : '0'}deg);` : ''

    const textAlignStyle = align ? `text-align: ${align};` : ''

    return [
      inline ? 'span' : 'div',
      {
        style: textAlignStyle,
        class: 'image',
      },
      [
        'img',
        mergeAttributes(
          {
            height: 'auto',
            style: transformStyle,
          },
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
      ],
    ]
  },
  parseHTML() {
    return [
      {
        tag: 'span.image img',
        getAttrs: (img) => {
          const element = img?.parentElement

          const width = img?.getAttribute('width')

          const flipX = img?.getAttribute('flipx') || false
          const flipY = img?.getAttribute('flipy') || false

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            caption: img?.getAttribute('caption'),
            width: width ? Number.parseInt(width as string, 10) : null,
            align: img?.getAttribute('align') || element?.style?.textAlign || null,
            inline: img?.getAttribute('inline') || false,
            flipX: flipX === 'true',
            flipY: flipY === 'true',
          }
        },
      },
      {
        tag: 'div[class=image]',
        getAttrs: (element) => {
          const img = element.querySelector('img')

          const width = img?.getAttribute('width')
          const flipX = img?.getAttribute('flipx') || false
          const flipY = img?.getAttribute('flipy') || false

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            caption: img?.getAttribute('caption'),
            width: width ? Number.parseInt(width as string, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
            inline: img?.getAttribute('inline') || false,
            flipX: flipX === 'true',
            flipY: flipY === 'true',
          }
        },
      },
    ]
  },
  addProseMirrorPlugins() {
    const validateFile = (file: File): boolean => {
      // @ts-expect-error
      if (!this.options.acceptMimes.includes(file.type)) {
        // toast({ description: t.value('editor.imageUpload.fileTypeNotSupported'), duration: 2000 });
        return false
      }
      // @ts-expect-error
      if (file.size > this.options.maxSize) {
        // toast({
        //   description: `${t.value('editor.imageUpload.fileSizeTooBig')} ${formatFileSize(
        //     this.options.maxSize,
        //   )}.`,
        //   duration: 2000,
        // });
        return false
      }
      return true
    }

    const uploadFn = createImageUpload({
      validateFn: validateFile,
      onUpload: this.options.upload as any,
      // postUpload: this.options.postUpload,
    })

    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            if (!event.clipboardData) {
              return false
            }
            const items = [...(event.clipboardData.files || [])]
            if (items.some(x => x.type === 'text/html')) {
              return false
            }
            return handleImagePaste(view, event, uploadFn)
          },
          handleDrop: (view, event, _, moved) => {
            if (!(event instanceof DragEvent) || !event.dataTransfer) {
              return false
            }
            handleImageDrop(view, event, moved, uploadFn)
            return false
          },
        },
      }),
      UploadImagesPlugin(),
    ]
  },
})

export default Image
