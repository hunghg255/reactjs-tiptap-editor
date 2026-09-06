---
description: Color

next:
  text: Column
  link: /extensions/Column/index.md
---

# Color

Apply a text color to the current selection.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). Install `@tiptap/extension-text-style` at the same version as your other Tiptap packages. This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import { TextStyle } from '@tiptap/extension-text-style';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, TextStyle, Color];

export default function ColorExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextColor />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register `TextStyle` because color is stored as a text-style attribute. Select text and use the color picker. The commands are `editor.chain().focus().setColor("#2563eb").run()` and `editor.chain().focus().unsetColor().run()`.

## Configure the palette

Use this configuration in place of `Color` in your extension array:

```ts
import { Color } from 'reactjs-tiptap-editor/color';

Color.configure({
  colors: ['#dc2626', '#16a34a', '#2563eb', '#262626'],
  defaultColor: '#2563eb',
});
```

| Option         | Purpose                                  | Default                        |
| -------------- | ---------------------------------------- | ------------------------------ |
| `colors`       | Palette entries shown in the picker.     | Built-in palette when omitted. |
| `defaultColor` | Initial color for the keyboard action.   | None.                          |
| `shortcutKeys` | Shortcut label displayed by the control. | `['⇧', 'alt', 'C']`.           |

The actual keyboard binding is **Alt-Shift-C**. It applies the last chosen color, or removes it if the whole selection already has that color. Without a chosen/default color, it removes an existing text color or leaves uncolored text unchanged.

Changing `shortcutKeys` changes the label, not the binding. See [custom keyboard shortcuts](/guide/toolbar#keyboard-shortcuts).

## Programmatic formatting

With a registered Color extension and a non-null editor:

```ts
editor.chain().focus().setColor('#2563eb').run();
editor.chain().focus().unsetColor().run();
const currentColor = editor.getAttributes('textStyle').color;
```

Color changes text foreground. For a colored background behind text, use [Highlight](/extensions/Highlight/).
