---
description: Clear

next:
  text: Code
  link: /extensions/Code/index.md
---

# Clear

Remove text marks and reset block formatting in the current selection.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Clear];

export default function ClearExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextClear />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Select the content to reset and click the eraser. This runs `editor.chain().focus().clearNodes().unsetAllMarks().run()`: it clears formatting, not the document’s text. To intentionally empty the document, use Tiptap’s `editor.commands.clearContent()`.
