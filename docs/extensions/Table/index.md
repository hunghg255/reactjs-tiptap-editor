---
description: Table

next:
  text: TaskList
  link: /extensions/TaskList/index.md
---

# Table

Insert tables and edit their rows, columns, and cells.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table';
import { RichTextBubbleTable } from 'reactjs-tiptap-editor/bubble/table';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Table];

export default function TableExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextTable />
      <RichTextBubbleTable />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

The library’s `Table` includes row, header, cell, and cell-background extensions. Do not add duplicates. Click the toolbar grid to choose a table size, then select cells to use `RichTextBubbleTable`. You can also call `editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()`.
