---
description: Heading

next:
  text: Highlight
  link: /extensions/Highlight/index.md
---

# Heading

Turn a paragraph into a heading with a chosen level.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Heading.configure({ levels: [1, 2, 3] })];

export default function HeadingExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextHeading />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Place the cursor in a paragraph and choose a level from the toolbar. `levels` controls the available heading levels; for example, `Heading.configure({ levels: [1, 2, 3] })`. Use `editor.chain().focus().toggleHeading({ level: 2 }).run()` for a custom action.
