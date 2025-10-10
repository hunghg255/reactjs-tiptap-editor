import { Extension } from '@tiptap/core';
import type { default as Mammoth } from 'mammoth';

import ImportWordButton from '@/extensions/ImportWord/components/ImportWordButton';
import type { GeneralOptions } from '@/types';

export interface ImportWordOptions extends GeneralOptions<ImportWordOptions> {
  /** Function for converting Word files to HTML */
  convert?: (file: File) => Promise<string>

  /** Function for uploading images */
  upload?: (files: File[]) => Promise<unknown>

  /**
   * File Size limit(10 MB)
   *
   * @default 1024 * 1024 * 10
   */
  limit?: number
  mammothOptions?: Parameters<typeof Mammoth['convertToHtml']>[1]
}

export const ImportWord = /* @__PURE__ */ Extension.create<ImportWordOptions>({
  name: 'importWord',
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      convert: undefined,
      limit: 1024 * 1024 * 10, // 10 MB
      button: ({ editor, extension, t }) => {
        const { convert, limit, mammothOptions } = extension.options;
        return {
          component: ImportWordButton,
          componentProps: {
            editor,
            convert,
            limit,
            mammothOptions,
            action: () => editor.commands.setHorizontalRule(),
            disabled: !editor.can().setHorizontalRule(),
            icon: 'Word',
            shortcutKeys: extension.options.shortcutKeys ?? ['alt', 'mod', 'S'],
            tooltip: t('editor.importWord.tooltip'),
          },
        };
      },
    };
  },
});
