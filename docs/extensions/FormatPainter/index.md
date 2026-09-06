---
description: FormatPainter

next:
  text: Heading
  link: /extensions/Heading/index.md
---

# Format Painter

Copy inline formatting from one selection to another.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { FormatPainter, RichTextFormatPainter } from 'reactjs-tiptap-editor/formatpainter';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Bold, FormatPainter];

export default function FormatPainterExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextBold />
      <RichTextFormatPainter />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register the mark extensions you want to copy, such as Bold, Italic, Color, or FontSize. The painter copies existing marks; it does not add those features by itself. The example includes Bold so you can format a source selection before copying it.

## Behavior

1. Select text that already has the formatting you want to copy.
2. Click the format painter button.
3. Select the target text.
4. The copied marks are applied to the target selection and the format painter turns off automatically.

Press `Escape` or click the button again to cancel the format painter state.

## Commands

### setPainter

Copies the current selection marks and enables format painter mode.

```ts
editor.commands.setPainter();
```

### unsetPainter

Cancels format painter mode.

```ts
editor.commands.unsetPainter();
```
