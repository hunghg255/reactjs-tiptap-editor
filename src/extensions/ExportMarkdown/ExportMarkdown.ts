import { Extension } from '@tiptap/core';

import { downloadFromBlob } from '@/utils/download';

import type { CreateMarkdownOptions } from './createMarkdown';
import type { ButtonViewParams, GeneralOptions } from '@/types';
import type { Editor } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exportMarkdown: {
      /**
       * Serialize the document to markdown and download it as a `.md` file.
       */
      exportToMarkdown: (options?: { fileName?: string }) => ReturnType;
    };
  }
}

export interface ExportMarkdownOptions extends GeneralOptions<ExportMarkdownOptions> {
  /**
   * Name of the downloaded file.
   */
  fileName: string;
  /**
   * Indentation used for nested lists and code.
   */
  indentation?: CreateMarkdownOptions['indentation'];
}

export * from './components/RichTextExportMarkdown';

/**
 * Serialize the editor document to a markdown string. The serializer is
 * loaded on demand so it does not weigh on the initial bundle.
 */
export async function getMarkdown(editor: Editor, options: CreateMarkdownOptions = {}) {
  const { createMarkdown } = await import('./createMarkdown');

  return createMarkdown(editor, options);
}

export const ExportMarkdown = /* @__PURE__ */ Extension.create<ExportMarkdownOptions>({
  name: 'exportMarkdown',

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      fileName: 'richtext-export-document.md',
      button: ({ editor, t }: ButtonViewParams<ExportMarkdownOptions>) => ({
        componentProps: {
          icon: 'ExportMarkdown',
          action: () => {
            return editor?.commands.exportToMarkdown();
          },
          tooltip: t('editor.exportMarkdown.tooltip'),
          isActive: () => false,
          disabled: false,
        },
      }),
    };
  },

  addCommands() {
    return {
      exportToMarkdown:
        (options = {}) =>
        ({ dispatch, editor }) => {
          // Tiptap can() checks must not download files or load the serializer.
          if (dispatch) {
            const fileName = options.fileName ?? this.options.fileName;

            void getMarkdown(editor, { indentation: this.options.indentation })
              .then((markdown) => {
                const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
                return downloadFromBlob(blob, fileName);
              })
              .catch((error: unknown) => console.error('Error exporting to Markdown:', error));
          }
          return true;
        },
    };
  },
});
