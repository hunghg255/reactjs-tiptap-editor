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
import { RichTextBubbleKatex } from 'reactjs-tiptap-editor/bubble/katex';
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


## Renderer loading and chemistry

The renderer loads when a formula node view mounts or a formula dialog opens. Until it is ready, the preview displays the expression as text. Existing formulas can therefore trigger loading on the first editor render. A failed load offers a retry button; invalid formulas remain text. Rendering happens on the client, so server output does not contain rendered formula HTML.

Use the optional `loadKatex` configuration to initialize plugins before rendering. For chemistry commands such as `\ce{H2O}`, install `katex` directly and replace `Katex` in the extension array with:

```ts
import { Katex } from 'reactjs-tiptap-editor/katex';
import 'katex/dist/katex.min.css';

Katex.configure({
  loadKatex: async () => {
    const [{ default: katex }] = await Promise.all([
      import('katex'),
      import('katex/contrib/mhchem'),
    ]);
    return katex;
  },
});
```

If TypeScript cannot find types for mhchem, add this declaration to an ambient `.d.ts` file:

```ts
declare module 'katex/contrib/mhchem';
```

The loader must resolve to the KaTeX renderer, not the module namespace. Its promise is shared across node views and dialogs using the same loader function; failed loads can be retried. Keep the loader function stable. CSS remains an explicit static import. Avoid a static JavaScript import of KaTeX or mhchem elsewhere if you want the renderer to stay in an asynchronous chunk.
