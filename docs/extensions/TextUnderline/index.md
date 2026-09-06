---
description: UnderLine

next:
  text: Twitter
  link: /extensions/Twitter/index.md
---

# Underline

Underline selected text or text typed after enabling the mark.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { TextUnderline, RichTextUnderline } from 'reactjs-tiptap-editor/textunderline';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, TextUnderline];

export default function TextUnderlineExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextUnderline />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the underline button to toggle the mark. For a custom button, use `editor.chain().focus().toggleUnderline().run()`.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'U']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
