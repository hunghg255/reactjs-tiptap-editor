---
description: Export Word

next:
  text: FontFamily
  link: /extensions/FontFamily/index.md
---

# Export Word

Download the current document as a `.docx` file.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { ExportWord, RichTextExportWord } from 'reactjs-tiptap-editor/exportword';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, ExportWord];

export default function ExportWordExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextExportWord />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the toolbar button or call `editor.commands.exportToWord(editor.state.doc)`. The download uses `richtext-export-document.docx`. The current serializer excludes images and does not define mappings for every custom node or mark; test your document’s feature set before relying on Word export.


## Loading behavior

The Word serializer loads when export is requested. `exportToWord` returns a Tiptap command boolean immediately; it does not return a promise indicating that the download has finished. Serialization and download happen asynchronously, and failures are logged to the console. `editor.can().exportToWord(editor.state.doc)` does not load the serializer or start a download.
