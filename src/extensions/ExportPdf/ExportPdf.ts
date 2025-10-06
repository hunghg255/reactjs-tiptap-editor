import { Extension } from '@tiptap/core';

import { ActionButton } from '@/components';
import { printEditorContent } from '@/utils/pdf';

import type { GeneralOptions, PaperSize, PageMargin } from '@/types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exportPdf: {
      exportToPdf: () => ReturnType
    }
  }
}

export interface ExportPdfOptions extends GeneralOptions<ExportPdfOptions> {
  paperSize: PaperSize;
  title?: string;
  margins: {
    top?: PageMargin;
    right?: PageMargin;
    bottom?: PageMargin;
    left?: PageMargin;
  };
}

export const ExportPdf = /* @__PURE__ */ Extension.create<ExportPdfOptions>({
  name: 'exportPdf',
  addOptions() {
    return {
      ...this.parent?.(),
      paperSize: 'Letter',
      title: 'Echo Editor',
      margins: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in',
      },
      button: ({ editor, extension, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            printEditorContent(editor, extension.options);
          },
          icon: 'ExportPdf',
          tooltip: t('editor.exportPdf.tooltip'),
          isActive: () => false,
          disabled: false,
        },
      }),
    };
  },
  addCommands() {
    return {
      exportToPdf:
        () =>
          ({ editor }) => {
            return printEditorContent(editor, this.options);
          },
    };
  },
});
