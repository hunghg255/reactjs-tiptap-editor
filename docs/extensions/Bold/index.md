---
description: Bold

next:
  text: BulletList
  link: /extensions/BulletList/index.md
---

# Bold

Apply bold emphasis to selected text, or enable bold before typing.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Bold];

export default function BoldExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextBold />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Select a word and click **Bold**. Click again to remove the mark. Use `editor.chain().focus().toggleBold().run()` to trigger it from your own control.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'B']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
