---
description: ImageGif

next:
  text: ImportWord
  link: /extensions/ImportWord/index.md
---

# ImageGif

Search for animated GIFs and insert one into the document.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';
import { RichTextBubbleImageGif } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  Document,
  Paragraph,
  Text,
  ImageGif.configure({ provider: 'giphy', API_KEY: 'YOUR_GIPHY_API_KEY' }),
];

export default function ImageGifExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextImageGif />
      <RichTextBubbleImageGif />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Set `provider` to `"giphy"` (the default) or `"tenor"`, and supply that provider’s `API_KEY`. The placeholder in the example must be replaced for search to work. Click the GIF button, search, and choose a result. Mount `RichTextBubbleImageGif` for contextual editing.
