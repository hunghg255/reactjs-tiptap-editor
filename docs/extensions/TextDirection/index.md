---
description: TextDirection

next:
  text: TextUnderline
  link: /extensions/TextUnderline/index.md
---

# Text Direction

Set the writing direction of text blocks for left-to-right or right-to-left content.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { TextDirection, RichTextTextDirection } from 'reactjs-tiptap-editor/textdirection';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, TextDirection];

export default function TextDirectionExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
    textDirection: 'auto',
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextTextDirection />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

The example sets `textDirection: "auto"` on `useEditor` so the direction control can also restore automatic direction. Direction determines writing order; use [Text Align](/extensions/TextAlign/) to change alignment.
