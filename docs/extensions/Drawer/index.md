---
description: Drawer

next:
  text: Emoji
  link: /extensions/Emoji/index.md
---

# Drawer

Create freehand drawings and insert them into the document.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { RichTextBubbleDrawer } from 'reactjs-tiptap-editor/bubble/drawer';
import 'reactjs-tiptap-editor/style.css';
import 'easydrawer/styles.css';

const extensions = [Document, Paragraph, Text, Drawer];

export default function DrawerExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextDrawer />
      <RichTextBubbleDrawer />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Load `easydrawer/styles.css` alongside the editor stylesheet. Open the drawing dialog, draw, and apply the result. You can provide an `upload` callback resolving to a durable URL to store the generated SVG remotely. Install `easydrawer` directly if needed to resolve its CSS import.


## Loading behavior

The drawing canvas loads when a create or edit dialog opens. The first open may show a loading placeholder, and a failed module load offers a retry action. Keep the stylesheet import above so the canvas is styled when it becomes available.
