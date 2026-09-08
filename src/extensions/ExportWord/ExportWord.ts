import { Extension } from '@tiptap/core';

import { downloadFromBlob } from '@/utils/download';

import type { ButtonViewParams } from '@/types';
import type { GeneralOptions } from '@/types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exportWord: {
      exportToWord: (docState: import('@tiptap/pm/model').Node) => ReturnType;
    };
  }
}
type ExportWordOptions = GeneralOptions<ExportWordOptions>;

export * from './components/RichTextExportWord';

export const ExportWord = /* @__PURE__ */ Extension.create<ExportWordOptions>({
  name: 'exportWord',

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: ButtonViewParams<ExportWordOptions>) => ({
        componentProps: {
          icon: 'ExportWord',
          action: () => {
            return editor?.commands.exportToWord(editor?.state?.doc);
          },
          tooltip: t('editor.exportWord.tooltip'),
          isActive: () => false,
          disabled: false,
        },
      }),
    };
  },
  addCommands() {
    return {
      exportToWord:
        (docState) =>
        ({ dispatch }) => {
          // Tiptap can() checks must not download files or load the serializer.
          if (dispatch) {
            void import('./createWordBlob')
              .then(({ createWordBlob }) => createWordBlob(docState))
              .then((blob) => downloadFromBlob(blob, 'richtext-export-document.docx'))
              .catch((error: unknown) => console.error('Error exporting to Word:', error));
          }
          return true;
        },
    };
  },
});
