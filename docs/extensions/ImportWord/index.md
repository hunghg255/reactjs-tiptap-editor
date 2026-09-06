---
description: Import Word

next:
  text: Indent
  link: /extensions/Indent/index.md
---

# Import Word

Convert a Word `.docx` file into editor content.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { ImportWord, RichTextImportWord } from 'reactjs-tiptap-editor/importword';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, ImportWord];

export default function ImportWordExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextImportWord />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the toolbar button and choose a `.docx` file. Import replaces the current document, so save existing work first. The default file-size limit is 10 MiB. Converted HTML is parsed by the active schema, so register the formatting, list, table, and image extensions you want to preserve. Word page layout is not guaranteed to survive conversion.

## Configuration

| Option           | Purpose                                                            | Default                      |
| ---------------- | ------------------------------------------------------------------ | ---------------------------- |
| `limit`          | Maximum `.docx` file size in bytes.                                | `10 * 1024 * 1024`.          |
| `convert`        | Custom `(file: File) => Promise<string>` converter returning HTML. | Built-in Mammoth conversion. |
| `mammothOptions` | Options passed to the built-in HTML converter.                     | Omitted.                     |
| `upload`         | Upload embedded images extracted from the converted HTML.          | Omitted.                     |

For example, replace `ImportWord` in your array with:

```ts
import { ImportWord } from 'reactjs-tiptap-editor/importword';

ImportWord.configure({
  limit: 5 * 1024 * 1024,
});
```

### Embedded images

Register the library's `Image` extension to preserve imported images. The ImportWord `upload` handler receives a `File[]` and must resolve to an array of `{ src: string }` objects in the same order. This differs from the Image extension's upload handler, which receives one file and returns one URL string.

Without this handler, converted image sources remain in the HTML. The current upload processing expects base64 image sources from conversion; a custom `convert` implementation returning remote image URLs should handle image storage itself and omit this upload handler.
