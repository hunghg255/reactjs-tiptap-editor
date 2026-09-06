---
description: FontFamily

next:
  text: FontSize
  link: /extensions/FontSize/index.md
---

# Font Family

Choose the font family used by selected text.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). Install `@tiptap/extension-text-style` at the same version as your other Tiptap packages. This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { TextStyle } from '@tiptap/extension-text-style';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, TextStyle, FontFamily];

export default function FontFamilyExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextFontFamily />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register `TextStyle`. `fontFamilyList` controls the choices in the dropdown, but does not download fonts. Load web fonts in your application CSS, or choose fonts available on the reader’s device.

## Configuration

```ts
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily';

FontFamily.configure({
  fontFamilyList: ['Arial', 'Georgia', { name: 'Monospace', value: 'monospace' }],
});
```

Use this configured extension in place of the unconfigured one in `extensions`.
