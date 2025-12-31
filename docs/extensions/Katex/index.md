---
description: Katex

next:
  text: LineHeight
  link: /extensions/LineHeight/index.md
---

# Katex

- Katex Extension for Tiptap Editor.
- This extension allows you to add Katex math equations to your editor.
- Supports inline and block math equations.
- This extension is based on [katex](https://katex.org/).

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
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex'; // [!code ++]
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
  Katex// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <RichTextKatex /> {/* [!code ++] */}
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

