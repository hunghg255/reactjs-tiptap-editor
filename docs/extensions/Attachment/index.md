---
description: Attachment

next:
  text: Blockquote
  link: /extensions/Blockquote/index.md
---

# Attachment

Insert a downloadable file card with an application-provided upload handler.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Attachment, RichTextAttachment } from 'reactjs-tiptap-editor/attachment';
import 'reactjs-tiptap-editor/style.css';

async function uploadAttachment(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch('/api/attachments', { method: 'POST', body });
  if (!response.ok) throw new Error('Attachment upload failed');
  const data = await response.json();
  if (typeof data.url !== 'string' || !data.url) {
    throw new Error('Upload response must contain a URL');
  }
  return data.url;
}

const extensions = [Document, Paragraph, Text, Attachment.configure({ upload: uploadAttachment })];

export default function AttachmentExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextAttachment />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the attachment button to add a placeholder, then choose a file in that card. The upload callback receives one `File` and must resolve with its download URL. The endpoint in this example is yours to implement; it must return `{ "url": "https://..." }`. Save the document after uploading completes.
