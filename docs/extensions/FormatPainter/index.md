---
description: FormatPainter

next:
  text: Heading
  link: /extensions/Heading/index.md
---

# Format Painter

The Format Painter extension allows you to copy text marks from one selection and apply them to another selection.

This is a custom extension built on top of Tiptap and ProseMirror. It copies inline text marks such as bold, italic, underline, text color, highlight, font family, and font size. Link marks are skipped to avoid copying link targets unexpectedly.

## Usage

```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor'

// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Extension
import { FormatPainter, RichTextFormatPainter } from 'reactjs-tiptap-editor/formatpainter'; // [!code ++]
// ... other extensions


// Import CSS
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  // Base Extensions
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  })

  ...
  // Import Extensions Here
  FormatPainter// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <RichTextFormatPainter /> {/* [!code ++] */}
  )
}

const App = () => {
   const editor = useEditor({
    textDirection: 'auto', // global text direction
    extensions,
  });

  return (
    <RichTextProvider
      editor={editor}
    >
      <RichTextToolbar />

      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```

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
editor.commands.setPainter()
```

### unsetPainter

Cancels format painter mode.

```ts
editor.commands.unsetPainter()
```
