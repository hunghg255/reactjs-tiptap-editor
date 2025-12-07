import { Extension } from '@tiptap/core';
import type { Extensions } from '@tiptap/core';
import type { SubscriptExtensionOptions as TiptapSubscriptOptions } from '@tiptap/extension-subscript';
import { Subscript as TiptapSubscript } from '@tiptap/extension-subscript';
import type { SuperscriptExtensionOptions as TiptapSuperscriptOptions } from '@tiptap/extension-superscript';
import { Superscript as TiptapSuperscript } from '@tiptap/extension-superscript';

import type { Item } from '@/extensions/MoreMark/components/RichTextMoreMark';
import type { GeneralOptions } from '@/types';

export * from './components/RichTextMoreMark';

export interface MoreMarkOptions extends GeneralOptions<MoreMarkOptions> {
  /**
   * // options for Subscript Extension
   *
   * @default true
   */
  subscript: Partial<TiptapSubscriptOptions> | false
  /**
   * // options for Superscript Extension
   *
   * @default true
   */
  superscript: Partial<TiptapSuperscriptOptions> | false
}

export const MoreMark = /* @__PURE__ */ Extension.create<MoreMarkOptions>({
  name: 'moreMark',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
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

        const items: Item[] = [];

        if (subscript !== false) {
          items.push(subBtn);
        }
        if (superscript !== false) {
          items.push(superBtn);
        }

        return {
          // component: ActionMoreButton,
          componentProps: {
            icon: 'Type',
            tooltip: t('editor.moremark'),
            disabled: !editor.isEditable,
            items,
            isActive: () => {
                const find: any = items?.find((k: any) => k.isActive());

                return find;
              }
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
