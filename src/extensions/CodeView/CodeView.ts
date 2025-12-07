/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';

import type { GeneralOptions } from '@/types';

interface CodeViewOptions extends GeneralOptions<CodeViewOptions> {
  isCodeViewMode?: boolean;
}

export * from './components/RichTextCodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeView: {
      /**
             * Toggle code view mode
             */
      toggleCodeView: () => ReturnType
    }
  }
}

export const CodeView = /* @__PURE__ */ Extension.create<CodeViewOptions>({
  name: 'codeView',
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          componentProps: {
            action: () => {
              editor.commands.toggleCodeView();
            },
            isActive: () => {
  //@ts-expect-error
              return editor.storage.codeView.isActive;
            },
            disabled: false,
            icon: 'Html',
            tooltip: t('editor.codeView.tooltip') || 'View HTML Code',
            customClass: 'tiptap-code-view-button',
          },
        };
      },
    };
  },

  addStorage() {
    return {
      isActive: false,
      originalContent: '',
    };
  },

  addCommands() {
    return {
      toggleCodeView: () => ({ editor }) => {
  //@ts-expect-error
        const isActive = editor.storage.codeView.isActive;

        if (!isActive) {
          const htmlContent = editor.getHTML();
  //@ts-expect-error
          editor.storage.codeView.originalContent = htmlContent;

          const escapedHtml = htmlContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

          editor.commands.setContent(
            `<div class="tiptap-code-view-wrapper">${escapedHtml}</div>`
          );
        } else {
          editor.commands.setContent(editor.getText());
        }

  //@ts-expect-error
        editor.storage.codeView.isActive = !isActive;

        return true;
      },
    };
  },
});
