---
description: Blockquote

next:
  text: Bold
  link: /extensions/Bold/index.md
---

# Blockquote

Wrap paragraphs in a blockquote to distinguish quoted material.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Blockquote, RichTextBlockquote } from 'reactjs-tiptap-editor/blockquote';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Blockquote];

export default function BlockquoteExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextBlockquote />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Place the cursor in a paragraph or select several paragraphs, then click the blockquote button. Click it again to lift the content out of the quote. The command is `editor.chain().focus().toggleBlockquote().run()`.
