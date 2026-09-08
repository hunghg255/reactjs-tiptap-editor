---
description: Iframe

next:
  text: Image
  link: /extensions/Image/index.md
---

# Iframe

Embed external content in an iframe node.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';
import { RichTextBubbleIframe } from 'reactjs-tiptap-editor/bubble/iframe';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Iframe];

export default function IframeExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextIframe />
      <RichTextBubbleIframe />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Open the toolbar dialog and provide an embeddable URL. Mount `RichTextBubbleIframe` for contextual controls. Some sites block iframe embedding; use the service’s embed URL and ensure your application’s content-security policy permits that origin.
