/* eslint-disable prefer-promise-reject-errors */
import { mergeAttributes } from '@tiptap/core'
import TiptapImage from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

import ImageView from '@/extensions/Image/components/ImageView'
import ActionImageButton from '@/extensions/Image/components/ActionImageButton'
import type { GeneralOptions } from '@/types'

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

  inline?: boolean
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
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
}

export const Image = TiptapImage.extend<IImageOptions>({
  group: 'inline',
  inline: true,
  defining: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
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
    const { align, inline } = HTMLAttributes

    const style = align ? `text-align: ${align};` : ''

    return [
      inline ? 'span' : 'div', // Parent element
      {
        style,
        class: 'image',
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
    ]
  },
  parseHTML() {
    return [
      {
        tag: 'span[class=image]',
        getAttrs: (element) => {
          const img = element.querySelector('img')

          const width = img?.getAttribute('width')

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            caption: img?.getAttribute('caption'),
            width: width ? Number.parseInt(width as string, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
            inline: img?.getAttribute('inline') || false,
          }
        },
      },
      {
        tag: 'div[class=image]',
        getAttrs: (element) => {
          const img = element.querySelector('img')

          const width = img?.getAttribute('width')

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            caption: img?.getAttribute('caption'),
            width: width ? Number.parseInt(width as string, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
            inline: img?.getAttribute('inline') || false,
          }
        },
      },
    ]
  },
})

export default Image
