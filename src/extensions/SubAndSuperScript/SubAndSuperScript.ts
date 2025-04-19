import type { Extensions } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import type { SubscriptExtensionOptions as TiptapSubscriptOptions } from '@tiptap/extension-subscript';
import { Subscript as TiptapSubscript } from '@tiptap/extension-subscript';
import type { SuperscriptExtensionOptions as TiptapSuperscriptOptions } from '@tiptap/extension-superscript';
import { Superscript as TiptapSuperscript } from '@tiptap/extension-superscript';

import { ActionButton } from '@/components';
import type { ButtonViewReturn, GeneralOptions } from '@/types';

/**
 * Represents the interface for subscript and superscript options, extending GeneralOptions.
 */
export interface SubAndSuperScriptOptions extends GeneralOptions<SubAndSuperScriptOptions> {
  /**
   * subscript options or false, indicating whether subscript is enabled
   *
   * @default true
   */
  subscript: Partial<TiptapSubscriptOptions> | false
  /**
   * superscript options or false, indicating whether superscript is enabled
   *
   * @default true
   */
  superscript: Partial<TiptapSuperscriptOptions> | false
}

export const SubAndSuperScript = /* @__PURE__ */ Extension.create<SubAndSuperScriptOptions>({
  name: 'subAndSuperScript',

  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, extension, t }) => {
        const subscript = extension.options.subscript;
        const superscript = extension.options.superscript;

        const subBtn: ButtonViewReturn = {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.toggleSubscript(),
            isActive: () => editor.isActive('subscript') || false,
            disabled: !editor.can().toggleSubscript(),
            icon: 'Subscript',
            tooltip: t('editor.subscript.tooltip'),
          },
        };

        const superBtn: ButtonViewReturn = {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.toggleSuperscript(),
            isActive: () => editor.isActive('superscript') || false,
            disabled: !editor.can().toggleSuperscript(),
            icon: 'Superscript',
            tooltip: t('editor.superscript.tooltip'),
          },
        };

        const items: ButtonViewReturn[] = [];

        if (subscript !== false) {
          items.push(subBtn);
        }
        if (superscript !== false) {
          items.push(superBtn);
        }

        return items;
      },
    };
  },

  addExtensions() {
    const extensions: Extensions = [];

    if (this.options.subscript !== false) {
      extensions.push(TiptapSubscript.configure(this.options.subscript));
    }

    if (this.options.superscript !== false) {
      extensions.push(TiptapSuperscript.configure(this.options.superscript));
    }

    return extensions;
  },
});
