---
description: Search And Replace

next:
  text: ShortMessage
  link: /extensions/ShortMessage/index.md
---

# Search And Replace

Find text in the document and replace individual matches or all matches.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { SearchAndReplace, RichTextSearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, SearchAndReplace];

export default function SearchAndReplaceExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextSearchAndReplace />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Open the toolbar dialog, enter a search term, and use the match navigation before replacing. Register [History](/extensions/History/) if users should be able to undo replacements.

## Props

| Prop                       | Type         | Description                 | Default                   |
| -------------------------- | ------------ | --------------------------- | ------------------------- |
| `searchTerm`               | `string`     | Search Term                 | `''`                      |
| `replaceTerm`              | `string`     | Replace Term                | `''`                      |
| `searchResultClass`        | `string`     | Search Result Class         | `'search-result'`         |
| `searchResultCurrentClass` | `string`     | Search Result Current Class | `'search-result-current'` |
| `caseSensitive`            | `boolean`    | Case Sensitive              | `false`                   |
| `disableRegex`             | `boolean`    | Disable Regex               | `false`                   |
| `onChange`                 | `() => void` | On Change                   | `undefined`               |
