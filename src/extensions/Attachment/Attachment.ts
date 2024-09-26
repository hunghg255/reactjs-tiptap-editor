import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { getDatasetAttribute } from '@/utils/dom-dataset'
import { NodeViewAttachment } from '@/extensions/Attachment/components/NodeViewAttachment/NodeViewAttachment'
import { ActionButton } from '@/components'
import type { GeneralOptions } from '@/types'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      setAttachment: (attrs?: unknown) => ReturnType
    }
  }
}

export interface AttachmentOptions extends GeneralOptions<AttachmentOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>
}

export const Attachment = Node.create<AttachmentOptions>({
  name: 'attachment',
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
        class: 'attachment',
      },
      button: ({ editor, t }: any) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.chain().focus().setAttachment().run(),
          isActive: () => false,
          disabled: false,
          icon: 'Attachment',
          tooltip: t('editor.attachment.tooltip'),
        },
      }),
    }
  },

  parseHTML() {
    return [{ tag: 'div[class=attachment]' }]
  },

  renderHTML({ HTMLAttributes }) {
    // @ts-expect-error
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addAttributes() {
    return {
      fileName: {
        default: null,
        parseHTML: getDatasetAttribute('filename'),
      },
      fileSize: {
        default: null,
        parseHTML: getDatasetAttribute('filesize'),
      },
      fileType: {
        default: null,
        parseHTML: getDatasetAttribute('filetype'),
      },
      fileExt: {
        default: null,
        parseHTML: getDatasetAttribute('fileext'),
      },
      url: {
        default: null,
        parseHTML: getDatasetAttribute('url'),
      },
      hasTrigger: {
        default: false,
        parseHTML: element => getDatasetAttribute('hastrigger')(element) === 'true',
      },
      error: {
        default: null,
        parseHTML: getDatasetAttribute('error'),
      },
    }
  },

  addCommands() {
    return {
      setAttachment:
        (attrs = {}) =>
          ({ chain }) => {
            // @ts-expect-error
            return chain().insertContent({ type: this.name, attrs }).run()
          },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewAttachment)
  },
})
