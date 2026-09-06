---
description: HorizontalRule

next:
  text: Iframe
  link: /extensions/Iframe/index.md
---

# Horizontal Rule

Insert a horizontal separator between blocks.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, HorizontalRule];

export default function HorizontalRuleExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextHorizontalRule />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Place the cursor where the separator should appear, then click the toolbar button. The command is `editor.chain().focus().setHorizontalRule().run()`. Add Tiptap’s `TrailingNode` if you want a paragraph automatically created after a trailing non-paragraph block.

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'alt', 'S']`

Shortcut labels shown by the controls. See [keyboard shortcut configuration](/guide/toolbar#keyboard-shortcuts) to change actual key bindings.
