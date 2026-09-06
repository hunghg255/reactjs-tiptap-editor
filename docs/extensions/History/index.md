---
description: History

next:
  text: HorizontalRule
  link: /extensions/HorizontalRule/index.md
---

# History

Undo and redo editing transactions.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, History];

export default function HistoryExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextUndo />
      <RichTextRedo />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register `History` once. It extends Tiptap 3’s `UndoRedo` extension, so do not also register `UndoRedo` or StarterKit’s undo history. The buttons become available when there is a change to undo or redo. Defaults are `depth: 100` and `newGroupDelay: 500` (milliseconds).

## Options

### shortcutKeys

Type: `string[][]`\
Default: `[['mod', 'Z'], ['shift', 'mod', 'Z']]`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
