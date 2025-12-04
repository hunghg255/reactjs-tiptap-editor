/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AnyExtension } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import type { HardBreakOptions } from '@tiptap/extension-hard-break';
import { HardBreak } from '@tiptap/extension-hard-break';
import type { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import type { ListItemOptions, ListKeymapOptions, OrderedListOptions } from '@tiptap/extension-list';
import { ListItem, ListKeymap } from '@tiptap/extension-list';
import type { ParagraphOptions } from '@tiptap/extension-paragraph';
import { Paragraph } from '@tiptap/extension-paragraph';
import type { StrikeOptions } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import type { TextStyleOptions } from '@tiptap/extension-text-style';
import { TextStyle } from '@tiptap/extension-text-style';
import type { DropcursorOptions, TrailingNodeOptions } from '@tiptap/extensions';
import { CharacterCount, type CharacterCountOptions, Dropcursor, Focus, type FocusOptions, Gapcursor, Placeholder, type PlaceholderOptions, Selection, TrailingNode } from '@tiptap/extensions';

import { Column, MultiColumn } from '@/extensions/MultiColumn';
import type { TextBubbleOptions } from '@/extensions/TextBubble';
import { TextBubble } from '@/extensions/TextBubble';
import { localeActions } from '@/locales';

/**
 * Represents the interface for options in the base toolkit.
 */
export interface BaseKitOptions {
  /**
   * Whether to enable the document option
   *
   * @default false
   */
  multiColumn?: boolean

  /**
   * character count options or false, indicating whether to enable character count
   *
   * @default true
   */
  characterCount: Partial<CharacterCountOptions> | false

  /**
   * selection options or false, indicating whether to enable the selection
   *
   * @default true
   */
  selection: any | false

 /**
   * Focus options or false, indicating whether to enable focus functionality
   *
   * @default true
   */
  focus: Partial<FocusOptions> | false
   /**
   * Placeholder options or false, indicating whether to enable placeholders
   *
   * @default true
   */
  placeholder: Partial<PlaceholderOptions> | false
    /**
   * textBubble options or false, indicating whether to enable the textBubble
   *
   * @default true
   */
  textBubble: Partial<TextBubbleOptions> | false
    /**
   * Text Style options or false, indicating whether to enable text style functionality
   *
   * @default true
   */
  textStyle: Partial<TextStyleOptions> | false;

  /**
   * If set to false, the document extension will not be registered
   * @example document: false
   */
  document: false

  /**
   * If set to false, the dropcursor extension will not be registered
   * @example dropcursor: false
   */
  dropcursor: Partial<DropcursorOptions> | false

  /**
   * If set to false, the gapcursor extension will not be registered
   * @example gapcursor: false
   */
  gapcursor: false

  /**
   * If set to false, the hardBreak extension will not be registered
   * @example hardBreak: false
   */
  hardBreak: Partial<HardBreakOptions> | false

  /**
   * If set to false, the horizontalRule extension will not be registered
   * @example horizontalRule: false
   */
  horizontalRule: Partial<HorizontalRuleOptions> | false

  /**
   * If set to false, the listItem extension will not be registered
   * @example listItem: false
   */
  listItem: Partial<ListItemOptions> | false

  /**
   * If set to false, the listItemKeymap extension will not be registered
   * @example listKeymap: false
   */
  listKeymap: Partial<ListKeymapOptions> | false

  /**
   * If set to false, the orderedList extension will not be registered
   * @example orderedList: false
   */
  orderedList: Partial<OrderedListOptions> | false

  /**
   * If set to false, the paragraph extension will not be registered
   * @example paragraph: false
   */
  paragraph: Partial<ParagraphOptions> | false

  /**
   * If set to false, the strike extension will not be registered
   * @example strike: false
   */
  strike: Partial<StrikeOptions> | false

  /**
   * If set to false, the text extension will not be registered
   * @example text: false
   */
  text: false

  /**
   * If set to false, the trailingNode extension will not be registered
   * @example trailingNode: false
   */
  trailingNode: Partial<TrailingNodeOptions> | false
}

export const BaseKit = /* @__PURE__ */ Extension.create<BaseKitOptions>({
  name: 'base-kit',

  addExtensions() {
    const extensions: AnyExtension[] = [];

    if (this.options.placeholder !== false) {
      extensions.push(
        Placeholder.configure({
          placeholder: ({ node, pos, editor }) => {
            if (node?.type?.name === 'columns' || node?.content?.size !== 0) {
              return '';
            }

            if (node?.type?.name === 'heading') {
              // @ts-expect-error
              return `${localeActions.t(`editor.heading.h${node.attrs.level}.tooltip`)}`;
            }
            if (node?.type?.name === 'codeBlock' || node?.type?.name === 'table') {
              return '';
            }
            if (editor.extensionManager.extensions.some(ext => ext.name === 'slashCommand')) {
              return localeActions.t('editor.slash');
            }
            if (pos === 0) {
              return localeActions.t('editor.content');
            }
            return localeActions.t('editor.content');
          },
          ...this.options.placeholder,
        }),
      );
    }

    if (this.options.focus !== false) {
      extensions.push(
        Focus.configure({
          className: 'focus',
          ...this.options.focus,
        }),
      );
    }

    if (this.options.textBubble !== false) {
      extensions.push(TextBubble.configure());
    }

    if (this.options.characterCount !== false) {
      extensions.push(CharacterCount.configure(this.options.characterCount));
    }

    if (this.options.textStyle !== false) {
      extensions.push(TextStyle.configure(this.options.textStyle));
    }

    if (this.options.selection !== false) {
      extensions.push(Selection);
    }

    if (this.options.multiColumn !== false) {
      extensions.push(Column, MultiColumn);
    }

    if (this.options.document !== false) {
      extensions.push(Document.configure(this.options.document));
    }

    if (this.options.dropcursor !== false) {
      extensions.push(Dropcursor.configure(this.options.dropcursor));
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure(this.options.gapcursor));
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak));
    }

    if (this.options.horizontalRule !== false) {
      extensions.push(HorizontalRule.configure(this.options.horizontalRule));
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem));
    }

    if (this.options.listKeymap !== false) {
      extensions.push(ListKeymap.configure(this.options?.listKeymap));
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options.paragraph));
    }

    if (this.options.text !== false) {
      extensions.push(Text.configure(this.options.text));
    }

    if (this.options.trailingNode !== false) {
      extensions.push(TrailingNode.configure(this.options?.trailingNode));
    }

    return extensions;
  },
});
