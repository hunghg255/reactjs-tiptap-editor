---
description: Code

next:
  text: CodeBlock
  link: /extensions/CodeBlock/index.md
---

# Code

Format a short piece of text as inline code.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Code];

export default function CodeExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextCode />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Select text such as a variable name and click the code button. For multiple lines with a language selector, use [Code Block](/extensions/CodeBlock/) instead. The inline command is `editor.chain().focus().toggleCode().run()`.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'E']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
