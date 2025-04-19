/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ActionButton } from '@/components';
import { getFileTypeIcon } from '@/extensions/Attachment/components/NodeViewAttachment/FileIcon';
import { NodeViewAttachment } from '@/extensions/Attachment/components/NodeViewAttachment/NodeViewAttachment';
import type { GeneralOptions } from '@/types';
import { getDatasetAttribute } from '@/utils/dom-dataset';
import { normalizeFileSize } from '@/utils/file';

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

export const Attachment = /* @__PURE__ */ Node.create<AttachmentOptions>({
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
    };
  },

  parseHTML() {
    return [{ tag: 'div[class=attachment]' }];
  },

  renderHTML({ HTMLAttributes }) {
    // Destructure and provide fallback defaults
    const {
      url = '',
      fileName = '',
      fileSize = '',
      fileType = '',
      fileExt = '',
    } = HTMLAttributes || {};

    // Validate attributes and merge safely
    const mergedAttributes = mergeAttributes(
      // @ts-expect-error
      this.options.HTMLAttributes || {},
      HTMLAttributes || {},
    );

    // Return the structured array
    return [
      'div',
      mergedAttributes,
      url
        ? [
          'a',
          { href: url || '#' },
          [
            'span',
            { class: 'attachment__icon' },
            getFileTypeIcon(fileType, true),
          ],
          [
            'span',
            { class: 'attachment__text' },
            `${fileName}.${fileExt} (${normalizeFileSize(fileSize)})`,
          ],
        ]
        : ['div', { class: 'attachment__placeholder' }],
    ];
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
    };
  },

  addCommands() {
    return {
      setAttachment:
        (attrs = {}) =>
          ({ chain }) => {
            // @ts-expect-error
            return chain().insertContent({ type: this.name, attrs }).run();
          },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewAttachment);
  },
});
