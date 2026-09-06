---
description: Indent

next:
  text: Italic
  link: /extensions/Italic/index.md
---

# Indent

Increase or decrease indentation of supported blocks.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Indent];

export default function IndentExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextIndent />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Place the cursor in a paragraph and use the indent controls. For list nesting, register the corresponding list and item extensions too. Indentation changes layout; it does not insert spaces into the text.

## Options

### shortcutKeys

Type: `string[][]`\
Default: `[['Tab'], ['Shift', 'Tab']]`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
