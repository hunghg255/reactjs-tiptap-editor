---
description: TextAlign

next:
  text: TextDirection
  link: /extensions/TextDirection/index.md
---

# Text Align

Align supported text blocks to the left, center, right, or both margins.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, TextAlign];

export default function TextAlignExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextAlign />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Place the cursor in a paragraph and choose an alignment. Configure `types` with the node names you want to support, for example `TextAlign.configure({ types: ["paragraph", "heading"] })`. Register Heading as well if your document uses headings.

## Options

### shortcutKeys

Type: `string[][]`\
Default: `[['mod', 'shift', 'L'], ['mod', 'shift', 'E'], ['mod', 'shift', 'R'], ['mod', 'shift', 'J']]`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
