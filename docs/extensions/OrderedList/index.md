---
description: OrderedList

next:
  text: SearchAndReplace
  link: /extensions/SearchAndReplace/index.md
---

# Ordered List

Organize paragraphs into a numbered list.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). Install `@tiptap/extension-list` at the same version as your other Tiptap packages. This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { ListItem } from '@tiptap/extension-list';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, ListItem, OrderedList];

export default function OrderedListExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextOrderedList />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register `ListItem` alongside `OrderedList`. Select paragraphs and click the numbered-list button, or call `editor.chain().focus().toggleOrderedList().run()`.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'shift', '7']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
