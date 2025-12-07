import { mergeAttributes } from '@tiptap/core';
import type { HorizontalRuleOptions as TiptapHorizontalRuleOptions } from '@tiptap/extension-horizontal-rule';
import { HorizontalRule as TiptapHorizontalRule } from '@tiptap/extension-horizontal-rule';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';
export * from './components/RichTextHorizontalRule';

export interface HorizontalRuleOptions
  extends TiptapHorizontalRuleOptions,
  GeneralOptions<HorizontalRuleOptions> {}

export const HorizontalRule = /* @__PURE__ */ TiptapHorizontalRule.extend<HorizontalRuleOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.setHorizontalRule(),
          disabled: !editor.can().setHorizontalRule(),
          icon: 'Minus',
          shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'alt', 'S'],
          tooltip: t('editor.horizontalrule.tooltip'),
        },
      }),
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-s': () => this.editor.commands.setHorizontalRule(),
    };
  },
  renderHTML() {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': this.name,
      }),
      ['hr'],
    ];
  },
});
