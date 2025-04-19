/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AnyExtension } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import type { CharacterCountOptions } from '@tiptap/extension-character-count';
import CharacterCount from '@tiptap/extension-character-count';
import type { DropcursorOptions } from '@tiptap/extension-dropcursor';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import type { FocusOptions } from '@tiptap/extension-focus';
import Focus from '@tiptap/extension-focus';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import type { HardBreakOptions } from '@tiptap/extension-hard-break';
import { HardBreak } from '@tiptap/extension-hard-break';
import type { ListItemOptions } from '@tiptap/extension-list-item';
import { ListItem } from '@tiptap/extension-list-item';
import type { ParagraphOptions } from '@tiptap/extension-paragraph';
import { Paragraph } from '@tiptap/extension-paragraph';
import type { PlaceholderOptions } from '@tiptap/extension-placeholder';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';
import type { TextStyleOptions } from '@tiptap/extension-text-style';
import { TextStyle } from '@tiptap/extension-text-style';

import { Document } from '@/extensions/Document';
import { Column, MultiColumn } from '@/extensions/MultiColumn';
import { Selection } from '@/extensions/Selection';
import type { TextBubbleOptions } from '@/extensions/TextBubble';
import { TextBubble } from '@/extensions/TextBubble';
import type { TrailingNodeOptions } from '@/extensions/TrailingNode';
import { TrailingNode } from '@/extensions/TrailingNode';
import { localeActions } from '@/locales';

/**
 * Represents the interface for options in the base toolkit.
 */
export interface BaseKitOptions {
  /**
   * Whether to enable the document option
   *
   * @default true
   */
  document: false
  /**
   * Whether to enable the document option
   *
   * @default false
   */
  multiColumn?: boolean
  /**
   * Whether to enable the text option
   *
   * @default true
   */
  text: false

  /**
   * Whether to enable the Gapcursor
   *
   * @default true
   */
  gapcursor: false

  /**
   * Dropcursor options or false, indicating whether to enable the drop cursor
   *
   * @default true
   */
  dropcursor: Partial<DropcursorOptions> | false

  /**
   * character count options or false, indicating whether to enable character count
   *
   * @default true
   */
  characterCount: Partial<CharacterCountOptions> | false

  /**
   * HardBreak options or false, indicating whether to enable hard breaks
   *
   * @default true
   */
  hardBreak: Partial<HardBreakOptions> | false

  /**
   * Placeholder options or false, indicating whether to enable placeholders
   *
   * @default true
   */
  placeholder: Partial<PlaceholderOptions> | false

  /**
   * Paragraph options or false, indicating whether to enable paragraph functionality
   *
   * @default true
   */
  paragraph: Partial<ParagraphOptions> | false

  /**
   * Focus options or false, indicating whether to enable focus functionality
   *
   * @default true
   */
  focus: Partial<FocusOptions> | false

  /**
   * ListItem options or false, indicating whether to enable list item functionality
   *
   * @default true
   */
  listItem: Partial<ListItemOptions> | false

  /**
   * Text Style options or false, indicating whether to enable text style functionality
   *
   * @default true
   */
  textStyle: Partial<TextStyleOptions> | false

  /**
   * Bubble options, taking `BubbleOptions<BaseKitOptions>` as parameters, indicating whether to enable the bubble functionality
   */
  // bubble: Partial<BubbleOptions<BaseKitOptions>>;
  bubble: any

  /**
   * Iframe options or false, indicating whether to enable the iframe
   *
   * @default true
   */
  // iframe: Partial<IframeOptions> | false;

  /**
   * Trailing node options or false, indicating whether to enable the trailing node
   *
   * @default true
   */
  trailingNode: Partial<TrailingNodeOptions> | false
  /**
   * textBubble options or false, indicating whether to enable the textBubble
   *
   * @default true
   */
  textBubble: Partial<TextBubbleOptions> | false
  /**
   * selection options or false, indicating whether to enable the selection
   *
   * @default true
   */
  selection: any | false
}

export const BaseKit = /* @__PURE__ */ Extension.create<BaseKitOptions>({
  name: 'base-kit',

  addExtensions() {
    const extensions: AnyExtension[] = [];

    if (this.options.document !== false) {
      extensions.push(Document.configure());
    }

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

    if (this.options.text !== false) {
      extensions.push(Text.configure());
    }
    if (this.options.textBubble !== false) {
      extensions.push(TextBubble.configure());
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure());
    }

    if (this.options.dropcursor !== false) {
      extensions.push(
        Dropcursor.configure({
          ...this.options.dropcursor,
          width: 2,
          class: 'ProseMirror-dropcursor border-black',
        }),
      );
    }

    if (this.options.characterCount !== false) {
      extensions.push(CharacterCount.configure(this.options.characterCount));
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options.paragraph));
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak));
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem));
    }

    if (this.options.textStyle !== false) {
      extensions.push(TextStyle.configure(this.options.textStyle));
    }

    if (this.options.trailingNode !== false) {
      extensions.push(TrailingNode.configure(this.options.trailingNode));
    }

    if (this.options.selection !== false) {
      extensions.push(Selection);
    }

    if (this.options.multiColumn !== false) {
      extensions.push(Column, MultiColumn);
    }

    return extensions;
  },
});
