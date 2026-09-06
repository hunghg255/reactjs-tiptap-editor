---
description: CodeView

next:
  text: Color
  link: /extensions/Color/index.md
---

# CodeView

Toggle between rich text and editable HTML source in the document area.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, CodeView];

export default function CodeViewExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextCodeView />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the toolbar button to show serialized HTML as text in the editor. Edit it, then click again to parse it back into rich text. Both transitions replace editor content and emit updates. Return to rich-text mode before saving; saving while source mode is active would store the source-text document. Unsupported markup may be removed by the active schema. This is an HTML source view, not the [Code Block](/extensions/CodeBlock/) feature for displaying code in a document.
