/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

export interface CodeViewOptions extends GeneralOptions<CodeViewOptions> {
  isCodeViewMode?: boolean;
}

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
          component: ActionButton,
          componentProps: {
            action: () => {
              editor.commands.toggleCodeView();
            },
            isActive: () => {
  //@ts-expect-error
              return editor.storage.codeView.isActive || false;
            },
            disabled: false,
            icon: 'CodeView',
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
