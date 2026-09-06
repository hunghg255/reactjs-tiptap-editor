---
description: Twitter

next:
  text: Video
  link: /extensions/Video/index.md
---

# Twitter

Embed a Twitter/X post in the document.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Twitter, RichTextTwitter } from 'reactjs-tiptap-editor/twitter';
import { RichTextBubbleTwitter } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Twitter];

export default function TwitterExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextTwitter />
      <RichTextBubbleTwitter />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Open the toolbar dialog and enter a supported post URL. Displaying the post depends on its availability and the embed service. Mount `RichTextBubbleTwitter` for contextual actions; a saved editor node does not archive the remote post.
