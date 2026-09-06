---
description: Katex

next:
  text: LineHeight
  link: /extensions/LineHeight/index.md
---

# Katex

Insert mathematical expressions written in TeX syntax.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import { RichTextBubbleKatex } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';
import 'katex/dist/katex.min.css';

const extensions = [Document, Paragraph, Text, Katex];

export default function KatexExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextKatex />
      <RichTextBubbleKatex />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Load `katex/dist/katex.min.css` alongside the editor stylesheet. Open the toolbar dialog, enter an expression such as `E = mc^2`, and apply it. Mount `RichTextBubbleKatex` for contextual actions. Install `katex` directly in your app if your package manager cannot resolve the CSS import.
