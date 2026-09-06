---
description: Bubble Menu

next:
  text: Internationalization
  link: /guide/internationalization.md
---

# Bubble Menu

Bubble menus provide actions near selected text or a selected node. They are separate React components: register the corresponding extensions, then mount the menus inside the same `RichTextProvider` as the document.

Importing a menu does not mount it, and mounting a menu does not register its extension.

## Add a text selection menu

This example uses the packages from [Getting Started](/guide/getting-started). Select a word in the editor to show the menu:

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Bold, Italic];

export default function BubbleMenuExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Select a few words to format them.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextBubbleText
        buttonBubble={
          <>
            <RichTextBold />
            <RichTextItalic />
          </>
        }
      />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

`buttonBubble` replaces the default text controls with your own React content. Each control still needs its corresponding extension. Omit the prop to use the library's default text menu; register the formatting and block features you intend to offer there.

A regular toolbar and a bubble menu can coexist. Both operate on the same editor instance.

## Add a node menu

For images, register `Image` in the existing extension array and mount `RichTextBubbleImage` under the provider. Select an inserted image to show its controls. Follow the same pattern for the other supported nodes:

| Menu component             | Required feature                                        | Purpose                         |
| -------------------------- | ------------------------------------------------------- | ------------------------------- |
| `RichTextBubbleText`       | Text and the formatting extensions used by its controls | Format selected text.           |
| `RichTextBubbleLink`       | [Link](/extensions/Link/)                               | Edit an existing link.          |
| `RichTextBubbleImage`      | [Image](/extensions/Image/)                             | Edit a selected image.          |
| `RichTextBubbleVideo`      | [Video](/extensions/Video/)                             | Edit a selected video.          |
| `RichTextBubbleTable`      | [Table](/extensions/Table/)                             | Edit table structure and cells. |
| `RichTextBubbleIframe`     | [Iframe](/extensions/Iframe/)                           | Edit an embedded frame.         |
| `RichTextBubbleColumns`    | [Column and companion nodes](/extensions/Column/)       | Manage column layouts.          |
| `RichTextBubbleImageGif`   | [ImageGif](/extensions/ImageGif/)                       | Edit a selected GIF.            |
| `RichTextBubbleDrawer`     | [Drawer](/extensions/Drawer/)                           | Edit a drawing node.            |
| `RichTextBubbleExcalidraw` | [Excalidraw](/extensions/Excalidraw/)                   | Edit an Excalidraw node.        |
| `RichTextBubbleMermaid`    | [Mermaid](/extensions/Mermaid/)                         | Edit a diagram node.            |
| `RichTextBubbleTwitter`    | [Twitter](/extensions/Twitter/)                         | Manage a post embed.            |
| `RichTextBubbleCallout`    | [Callout](/extensions/Callout/)                         | Edit a callout.                 |
| `RichTextBubbleKatex`      | [Katex](/extensions/Katex/)                             | Edit a mathematical expression. |
| `RichTextBubbleCodeBlock`  | [CodeBlock](/extensions/CodeBlock/)                     | Access code-block actions.      |

All menu components in this table are exported from `reactjs-tiptap-editor/bubble`. Mount each menu once per editor and only include the menus your editor needs.

## Block drag handle

`RichTextBubbleMenuDragHandle` provides a handle for moving document blocks and a block action menu. It does not move the bubble menu itself.

```tsx
import { RichTextBubbleMenuDragHandle } from 'reactjs-tiptap-editor/bubble';

// Mount inside your existing RichTextProvider.
<RichTextBubbleMenuDragHandle />;
```

## Slash commands

`SlashCommandList` supplies the slash command list and is not a text-selection bubble menu. Mount it inside the provider and register `SlashCommand` to enable `/` commands. See [Slash Command](/extensions/SlashCommand/).

## Troubleshooting

If a menu does not appear, confirm that the editor is editable, its matching extension is registered, and the appropriate content is selected. A collapsed text cursor does not show the text-selection menu. Check clipping or stacking styles in your host layout if a menu appears behind another element.
