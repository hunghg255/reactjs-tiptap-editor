---
description: TableOfContents

next:
  text: TaskList
  link: /extensions/TaskList/index.md
---

# TableOfContents

Track the headings of the document and insert a live table of contents block.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Heading } from 'reactjs-tiptap-editor/heading';
import {
  TableOfContents,
  RichTextTableOfContents,
} from 'reactjs-tiptap-editor/tableofcontents';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Heading, TableOfContents];

export default function TableOfContentsExample() {
  const editor = useEditor({
    extensions,
    content: '<h1>Title</h1><p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextTableOfContents />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

`TableOfContents` does two things:

1. It watches every heading, gives each one a stable `id` / `data-toc-id` attribute and exposes the list through `editor.storage.tableOfContents.content`.
2. It registers the `tableOfContentsNode` block. Press the toolbar button or type `/toc` to insert it. The block re-renders whenever headings change, numbers entries hierarchically (`1`, `1.1`, `1.1.1`), highlights the heading currently in view, and scrolls to a heading when clicked.

The block is rendered as `<div data-type="table-of-contents"></div>` in the exported HTML; the list itself is generated at runtime from the headings.

## Insert from code

```ts
editor.chain().focus().insertTableOfContents().run();
```

## Render the outline outside the editor

Use the `useTableOfContents` hook to build a sidebar with the same data:

```tsx
import {
  useTableOfContents,
  scrollToTableOfContentsItem,
} from 'reactjs-tiptap-editor/tableofcontents';

function Outline({ editor }) {
  const items = useTableOfContents(editor);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} style={{ paddingLeft: (item.level - 1) * 12 }}>
          <button onClick={() => scrollToTableOfContentsItem(editor, item)}>
            {item.textContent}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Options

```ts
import { getLinearIndexes } from 'reactjs-tiptap-editor/tableofcontents';

TableOfContents.configure({
  // node types that count as headings (default: ['heading'])
  anchorTypes: ['heading'],
  // hierarchical numbering by default; use getLinearIndexes for 1, 2, 3…
  getIndex: getLinearIndexes,
  // generate stable ids instead of random uuids
  getId: (text) => text.toLowerCase().replace(/\s+/g, '-'),
  // element that scrolls, used to compute the active heading (default: window)
  scrollParent: () => document.querySelector('.editor-scroll'),
  HTMLAttributes: { class: 'table-of-contents' },
});
```
