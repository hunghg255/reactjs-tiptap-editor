---
description: Italic

next:
  text: Katex
  link: /extensions/Katex/index.md
---

# Italic

Apply italic emphasis to selected text.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Italic];

export default function ItalicExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextItalic />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Select text and click **Italic**, or enable it before typing. The command is `editor.chain().focus().toggleItalic().run()`.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'I']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
