/* eslint-disable prefer-promise-reject-errors */
import { Plugin } from '@tiptap/pm/state'
import { Node, ReactNodeViewRenderer } from '@tiptap/react'

import { ActionButton } from '@/components'
import ImageUploader from '@/extensions/ImageUpload/components/ImageUploader'
import {
  UploadImagesPlugin,
  createImageUpload,
  handleImageDrop,
  handleImagePaste,
} from '@/plugins/image-upload'

export interface ImageUploadOptions {
  upload: (file: File) => Promise<string>
  acceptMimes: string[]
  maxSize: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType
    }
  }
}

const DEFAULT_OPTIONS: Partial<ImageUploadOptions> = {
  acceptMimes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
  maxSize: 1024 * 1024 * 5, // 5MB
}

// function formatFileSize(bytes: number): string {
//   const megabytes = bytes / 1024 / 1024
//   return `${megabytes.toFixed(2)}MB`
// }

export const ImageUpload = Node.create<ImageUploadOptions>({
  name: 'imageUpload',
  isolating: true,
  defining: true,
  group: 'block',
  draggable: false,
  selectable: true,
  inline: false,

  onCreate() {
    if (typeof this.options.upload !== 'function') {
      throw new TypeError('Image upload function should be a function')
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },

  renderHTML() {
    return ['div', { 'data-type': this.name }]
  },

  addCommands() {
    return {
      setImageUpload:
        () =>
          ({ commands }) =>
            commands.insertContent(`<div data-type="${this.name}"></div>`),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploader)
  },

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
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.setImageUpload(),
          upload: extension.options.upload,
          /* If setImage is not available(when Image Component is not imported), the button is disabled */
          disabled: !editor.can().setImage?.({}),
          icon: 'ImageUp',
          tooltip: t('editor.image.tooltip'),
        },
      }),
    }
  },

  addProseMirrorPlugins() {
    // const { toast } = useToast();
    // const { t } = useLocale();

    const validateFile = (file: File): boolean => {
      if (!this.options.acceptMimes.includes(file.type)) {
        // toast({ description: t.value('editor.imageUpload.fileTypeNotSupported'), duration: 2000 });
        return false
      }
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
      onUpload: this.options.upload,
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

export default ImageUpload
