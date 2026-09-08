---
description: Link

next:
  text: Mention
  link: /extensions/Mention/index.md
---

# Link

Add or edit a hyperlink on text.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { RichTextBubbleLink } from 'reactjs-tiptap-editor/bubble/link';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Link];

export default function LinkExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextLink />
      <RichTextBubbleLink />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Select the text to link, open the toolbar dialog, and enter a URL. Mount `RichTextBubbleLink` to edit a link after selecting it. Use `editor.chain().focus().setLink({ href: "https://example.com" }).run()` to apply a link to a selection, and `unsetLink()` to remove it.
