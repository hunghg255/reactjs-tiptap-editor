import type { CommandProps } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'

import { ReactNodeViewRenderer } from '@tiptap/react'
import TiptapImage from '@tiptap/extension-image'
import { MermaidActiveButton } from '@/extensions/Mermaid/components/MermaidActiveButton'
import type { GeneralOptions } from '@/types'
import { NodeViewMermaid } from '@/extensions/Mermaid/components/NodeViewMermaid/NodeViewMermaid'

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

export const Mermaid = TiptapImage.extend<MermaidOptions>({
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

          },
          isActive: () => false,
          disabled: false,
          editor,
          icon: 'Mermaid',
          tooltip: t('editor.mermaid.tooltip'),
          upload: extension?.options?.upload,
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
          const width = element.style.width || element.getAttribute('width') || '10'
          return width === undefined ? null : Number.parseInt(`${width}`, 10)
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.style.height || element.getAttribute('height') || '10'
          return height === undefined ? null : Number.parseInt(`${height}`, 10)
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
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
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewMermaid)
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
                })
              }
              return commands.insertContentAt(editor.state.selection.anchor, {
                type: this.name,
                attrs: options,
              })
            },

      setAlignImageMermaid:
            (align: any) =>
              ({ commands }: any) => {
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
    ]
  },
  parseHTML() {
    return [
      {
        tag: 'div[class=imageMermaid]',
        getAttrs: (element) => {
          const img = element.querySelector('img')

          const width = img?.getAttribute('width')
          const height = img?.getAttribute('height')

          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            width: width ? Number.parseInt(width as string, 10) : null,
            height: height ? Number.parseInt(height as string, 10) : null,
            align: img?.getAttribute('align') || element.style.textAlign || null,
          }
        },
      },
    ]
  },
})
