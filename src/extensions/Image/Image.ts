/* eslint-disable eqeqeq */

import { mergeAttributes } from '@tiptap/core'
import TiptapImage from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

import ImageView from '@/extensions/Image/components/ImageView'

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
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
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
export const Image = TiptapImage.extend({
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
    }
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.style.width || element.getAttribute('width') || null
          return width == undefined ? null : Number.parseInt(width, 10)
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          }
        },
      },
      align: {
        default: 'left',
        parseHTML: element => element.getAttribute('align'),
        renderHTML: (attributes) => {
          return {
            align: attributes.align,
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
    const { align } = HTMLAttributes

    const style = align ? `text-align: ${align};` : ''
    return [
      'div', // Parent element
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
        tag: 'div[class=image]',
        getAttrs: (element) => {
          const img = element.querySelector('img')

          const width = img?.getAttribute('width')

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            title: img?.getAttribute('title'),
            width: width ? Number.parseInt(width as string, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
          }
        },
      },
    ]
  },
})

export default Image
