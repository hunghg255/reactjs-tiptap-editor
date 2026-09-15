---
description: Details

next:
  text: Drawer
  link: /extensions/Drawer/index.md
---

# Details

Collapsible toggle blocks with a summary line and hidden content, similar to Notion toggles.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Details, RichTextDetails } from 'reactjs-tiptap-editor/details';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Details];

export default function DetailsExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextDetails />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

`Details` registers three nodes at once: `details`, `detailsSummary` and `detailsContent`, so you only add the single extension. Press the toolbar button (or `Mod-Alt-D`) to wrap the current block in a toggle, and press it again inside a toggle to unwrap it. Type `/toggle` to insert one from the slash menu.

Click the chevron to open or close the block. The open state is stored in the document (`persist: true`), so it survives save and reload as `<details open>`.

Keyboard behaviour inside the toggle:

- `Enter` in the summary creates a paragraph inside the content when the block is open, or after the block when it is closed.
- `Backspace` at the start of an empty summary unwraps the toggle.
- `Enter` on the last empty paragraph of the content exits the toggle.

## Insert from code

With a non-null editor, you can wrap the current selection or unwrap it:

```ts
editor.chain().focus().setDetails().run();
editor.chain().focus().unsetDetails().run();
```

## Options

```ts
Details.configure({
  // keep the open state in the document (default: true)
  persist: true,
  // class added to the wrapper while open (default: 'is-open')
  openClassName: 'is-open',
  HTMLAttributes: { class: 'details' },
  // forwarded to the nested nodes
  summary: { HTMLAttributes: { class: 'details-summary' } },
  content: { HTMLAttributes: { class: 'details-content' } },
});
```
