import { Extension } from '@tiptap/core';
import type { Extensions } from '@tiptap/core';
import type { SubscriptExtensionOptions as TiptapSubscriptOptions } from '@tiptap/extension-subscript';
import { Subscript as TiptapSubscript } from '@tiptap/extension-subscript';
import type { SuperscriptExtensionOptions as TiptapSuperscriptOptions } from '@tiptap/extension-superscript';
import { Superscript as TiptapSuperscript } from '@tiptap/extension-superscript';

import type { Item } from '@/extensions/MoreMark/components/ActionMoreButton';
import ActionMoreButton from '@/extensions/MoreMark/components/ActionMoreButton';
import type { GeneralOptions } from '@/types';

export interface MoreMarkOptions extends GeneralOptions<MoreMarkOptions> {
  /**
   * // 下标
   *
   * @default true
   */
  subscript: Partial<TiptapSubscriptOptions> | false
  /**
   * // 上标
   *
   * @default true
   */
  superscript: Partial<TiptapSuperscriptOptions> | false
}

export const MoreMark = /* @__PURE__ */ Extension.create<MoreMarkOptions>({
  name: 'moreMark',
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, extension, t }) {
        const subscript = extension.options.subscript;
        const superscript = extension.options.superscript;
        const subBtn: Item = {
          action: () => editor.commands.toggleSubscript(),
          isActive: () => editor.isActive('subscript') || false,
          disabled: !editor.can().toggleSubscript(),
          icon: 'Subscript',
          title: t('editor.subscript.tooltip'),
          shortcutKeys: (extension.options.shortcutKeys?.[0] ?? ['mod', '.']) as string[],
        };

        const superBtn: Item = {
          action: () => editor.commands.toggleSuperscript(),
          isActive: () => editor.isActive('superscript') || false,
          disabled: !editor.can().toggleSuperscript(),
          icon: 'Superscript',
          title: t('editor.superscript.tooltip'),
          shortcutKeys: (extension.options.shortcutKeys?.[1] ?? ['mod', ',']) as string[],
        };
        // const hasCode = hasExtension(editor, 'code');

        const items: Item[] = [];

        if (subscript !== false) {
          items.push(subBtn);
        }
        if (superscript !== false) {
          items.push(superBtn);
        }
        // if (hasCode) {
        //   const codeBtn: Item = {
        //     action: () => editor.commands.toggleCode(),
        //     isActive: () => editor.isActive('code') || false,
        //     disabled: !editor.can().toggleCode(),
        //     icon: 'Code',
        //     title: t('editor.code.tooltip'),
        //     shortcutKeys: ['mod', 'E'],
        //   };
        //   if (hasCode) {
        //     items.push(codeBtn);
        //   }
        // }

        return {
          component: ActionMoreButton,
          componentProps: {
            icon: 'Type',
            tooltip: t('editor.moremark'),
            disabled: !editor.isEditable,
            items,
          },
        };
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
