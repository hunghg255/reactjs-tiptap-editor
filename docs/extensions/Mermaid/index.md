---
description: Mermaid

next:
  text: MoreMark
  link: /extensions/MoreMark/index.md
---

# Mermaid

Create editable diagrams from Mermaid source text.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { RichTextBubbleMermaid } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Mermaid];

export default function MermaidExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextMermaid />
      <RichTextBubbleMermaid />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the toolbar button, enter diagram source, and apply it to insert a diagram. Mount `RichTextBubbleMermaid` for contextual actions. Keep the Mermaid extension registered when reopening saved diagram nodes.
