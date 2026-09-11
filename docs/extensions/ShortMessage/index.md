---
description: ShortMessage

next:
  text: SlashCommand
  link: /extensions/SlashCommand/index.md
---

# Short Message

Insert predefined snippets from a list that opens with a keyboard shortcut (`Ctrl+Space` / `Cmd+Space` by default).

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { ShortMessage } from 'reactjs-tiptap-editor/shortmessage';
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  Document,
  Paragraph,
  Text,
  ShortMessage.configure({
    messages: [
      { short: 'nsfw', long_content: 'Not safe forward' },
      { short: 'brb', long_content: 'Be right back' },
      { short: 'sig', long_content: '<p>Best regards,<br><strong>Alex</strong></p>' },
    ],
  }),
];

export default function ShortMessageExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Press Ctrl+Space here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Place the caret inside a paragraph and press the shortcut. A list of every configured message appears at the caret. Keep typing to filter it; the filter matches the start of `short` first, then anything containing the text in `short` or `long_content`. Use the arrow keys to move through the list and Enter (or a click) to insert. The text typed while the list was open is replaced by `long_content`. Escape closes the list and keeps what you typed. Moving the caret out of the current block or clicking outside the editor also closes it. There is no toolbar button.

`long_content` is inserted with `insertContent`, so it may contain simple HTML such as `<strong>` or `<br>`. Plain strings are inserted as text.

## Options

| Option     | Type                                                                                      | Default       | Description                                                                              |
| ---------- | ----------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `messages` | `{ short: string; long_content: string }[]`                                               | `[]`          | Messages shown in the list. `short` is displayed and used for filtering.                 |
| `shortcut` | `string`                                                                                  | `'Mod-Space'` | Tiptap keyboard shortcut that opens the list.                                            |
| `items`    | `({ query, editor }) => ShortMessageItem[] \| Promise<ShortMessageItem[]>`                | —             | Replaces the built-in filter. Receives the text typed after the shortcut; may be async. |

### Custom shortcut

`shortcut` uses the Tiptap/ProseMirror keymap syntax: modifiers and the key are joined with `-` (not `+`), e.g. `Mod-Space`, `Shift-Space`, `Ctrl-Alt-m`. Available modifiers are `Mod` (Ctrl on Windows/Linux, Cmd on macOS), `Ctrl`, `Alt`, `Shift`, and `Cmd`/`Meta`. Key names are case-sensitive and follow `KeyboardEvent.key` (`Space`, `Enter`, `ArrowUp`, `F2`, `a`, `/`). A value such as `shift+space` is treated as a single unknown key name and never fires. See the [Tiptap keyboard shortcuts guide](https://tiptap.dev/docs/editor/core-concepts/keyboard-shortcuts) for the full list.

`Ctrl+Space` is reserved by some input methods (for example IME toggles on Windows or input-source switching on macOS). Pick another combination when that is a concern:

```ts
ShortMessage.configure({
  shortcut: 'Mod-Shift-Space',
  messages: [{ short: 'ty', long_content: 'Thank you!' }],
});
```

### Remote messages

Use `items` to fetch messages from an API instead of a static list:

```ts
ShortMessage.configure({
  items: async ({ query }) => {
    const res = await fetch(`/api/snippets?q=${encodeURIComponent(query)}`);
    return res.json(); // [{ short, long_content }]
  },
});
```
