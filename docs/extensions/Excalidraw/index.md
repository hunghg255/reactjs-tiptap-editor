---
description: Excalidraw

next:
  text: ExportPdf
  link: /extensions/ExportPdf/index.md
---

# Excalidraw

Create and insert Excalidraw drawings.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Excalidraw, RichTextExcalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { RichTextBubbleExcalidraw } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';
import '@excalidraw/excalidraw/index.css';

const extensions = [Document, Paragraph, Text, Excalidraw];

export default function ExcalidrawExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextExcalidraw />
      <RichTextBubbleExcalidraw />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Load `@excalidraw/excalidraw/index.css` alongside the editor stylesheet. Open the toolbar dialog, create a drawing, and apply it. Mount `RichTextBubbleExcalidraw` for contextual actions. Install `@excalidraw/excalidraw` directly if needed to resolve its CSS import.
