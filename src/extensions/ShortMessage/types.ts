import type { Editor } from '@tiptap/core';

export interface ShortMessageItem {
  /** Short key shown in the list and used for filtering, e.g. `nsfw` */
  short: string;
  /** Content inserted into the editor when the item is selected. Parsed as HTML. */
  long_content: string;
}

export interface ShortMessageOptions {
  /** Messages shown when the shortcut is pressed */
  messages: ShortMessageItem[];
  /**
   * Keyboard shortcut that opens the list. Uses Tiptap/ProseMirror keymap syntax: modifiers and the key
   * joined with `-` (not `+`), e.g. `Mod-Space`, `Shift-Space`, `Ctrl-Alt-m`. Key names are case-sensitive
   * (`Space`, `Enter`, `ArrowUp`, `a`, `F2`).
   */
  shortcut: string;
  /** Override the default filter. Receives the text typed after the shortcut. */
  items?: (props: {
    query: string;
    editor: Editor;
  }) => ShortMessageItem[] | Promise<ShortMessageItem[]>;
}

export interface ShortMessageStorage {
  /** Document position where the shortcut was pressed; `null` while the list is closed */
  anchor: number | null;
}
