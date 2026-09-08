---
description: Emoji

next:
  text: Excalidraw
  link: /extensions/Excalidraw/index.md
---

# Emoji

Insert emoji using a picker or suggestions.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Emoji];

export default function EmojiExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextEmoji />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Open the toolbar picker and choose an emoji. The extension supplies its emoji data and suggestion UI; no upload endpoint or separate toolbar provider is needed.

- Copy Emoji List here: https://github.com/hunghg255/reactjs-tiptap-editor-demo/blob/master/src/components/Editor/emojis.ts


## Loading behavior

The toolbar picker UI loads when the popover first opens. The extension still includes its full emoji dictionary for schema behavior, shortcodes, and document round trips; deferring the picker does not remove that dictionary. If you provide a separate suggestion dataset, you can dynamically import it from an asynchronous `suggestion.items` callback.
