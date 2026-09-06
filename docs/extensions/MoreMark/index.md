---
description: MoreMark

next:
  text: OrderedList
  link: /extensions/OrderedList/index.md
---

# More Mark

Add subscript and superscript formatting for formulas, references, and annotations.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, MoreMark];

export default function MoreMarkExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextMoreMark />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

The extension registers subscript and superscript marks for you. Select text and choose the desired mark from the menu. Disable one with `MoreMark.configure({ subscript: false })` or `{ superscript: false }`; avoid registering duplicate standalone marks.

## Options

### shortcutKeys

Type: `string[][]`\
Default: `[['mod', '.'], ['mod', ',']]`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
