import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { ActionButton } from '@/components'
import IframeNodeView from '@/extensions/Iframe/components/IframeNodeView'
import type { GeneralOptions } from '@/types'

export interface IframeOptions extends GeneralOptions<IframeOptions> {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: any
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string, service: string }) => ReturnType
    }
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframes',
  group: 'block',
  atom: true,
  addOptions() {
    return {
      ...this.parent?.(),
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
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
          action: (options: { src: string, service: string }) => editor.commands.setIframe(options),
          upload: extension.options.upload,
          disabled: !editor.can().setIframe({}),
          icon: 'Iframe',
          tooltip: t('editor.iframe.tooltip'),
        },
      }),
    }
  },
  addAttributes() {
    return {
      src: {
        default: null,
      },
      service: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },
  addNodeView() {
    return ReactNodeViewRenderer(IframeNodeView)
  },
  addCommands() {
    return {
      setIframe:
        (options: { src: string, service: string }) =>
          ({ tr, dispatch }) => {
            const { selection } = tr
            const node = this.type.create(options)

            if (dispatch) {
              tr.replaceRangeWith(selection.from, selection.to, node)
            }
            return true
          },
    }
  },
})
