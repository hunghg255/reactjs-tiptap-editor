---
description: Strike

next:
  text: Table
  link: /extensions/Table/index.md
---

# Strike

Mark text with a strikethrough while keeping the text in the document.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Strike];

export default function StrikeExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextStrike />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Select text and click the strikethrough button. Use `editor.chain().focus().toggleStrike().run()` from a custom control.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['shift', 'mod', 'S']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
