---
description: MultiColumn

next:
  text: Drawer
  link: /extensions/Drawer/index.md
---

# Column

Arrange document blocks in a multi-column layout.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import {
  Column,
  ColumnNode,
  MultipleColumnNode,
  RichTextColumn,
} from 'reactjs-tiptap-editor/column';
import { RichTextBubbleColumns } from 'reactjs-tiptap-editor/bubble/columns';
import 'reactjs-tiptap-editor/style.css';

const DocumentColumn = Document.extend({ content: '(block|columns)+' });

const extensions = [DocumentColumn, Paragraph, Text, Column, ColumnNode, MultipleColumnNode];

export default function ColumnExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextColumn />
      <RichTextBubbleColumns />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register all three exports: `Column` supplies behavior, while `ColumnNode` and `MultipleColumnNode` define the layout nodes. Replace the base Document with `DocumentColumn` as shown below; do not register both. Use `RichTextBubbleColumns` to access contextual column controls.
