---
description: CodeBlock

next:
  text: CodeView
  link: /extensions/CodeView/index.md
---

# CodeBlock

- The `CodeBlock` extension allows you to add code blocks to your editor. It supports syntax highlighting and language selection, making it ideal for displaying code snippets in a visually appealing way. Reference [code-block-lowlight](https://tiptap.dev/docs/editor/extensions/nodes/code-block-lowlight) for more details.
- The `RichTextCodeBlock` component provides a toolbar for the `CodeBlock` extension, allowing users to easily select the programming language for their code blocks.
- The `CodeBlock` extension is built on top of the `code-block-lowlight` extension, which uses the `lowlight` library for syntax highlighting. You can customize the languages supported by registering them with `lowlight`.
- The `RichTextBubbleCodeBlock` component provides a bubble menu for the `CodeBlock` extension, allowing users to easily delete code blocks.

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

// Bubble Menu
import { RichTextBubbleCodeBlock } from 'reactjs-tiptap-editor/bubble';

// Extension
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock'; // [!code ++]
// ... other extensions

// Import CSS
import 'reactjs-tiptap-editor/style.css';

// Optional: Import lowlight languages
// create a lowlight instance with all languages loaded
// const lowlight = createLowlight();

// // This is only an example, all supported languages are already loaded above
// // but you can also register only specific languages to reduce bundle-size
// lowlight.register('html', html);
// lowlight.register('css', css);
// lowlight.register('js', js);
// lowlight.register('ts', ts);

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
  CodeBlock// [!code ++]

  // Config Lowlight
  // CodeBlock.configure({
  //   lowlight: lowlight, // [!code ++]
  // }),
];

const RichTextToolbar = () => {
  return (
    <RichTextCodeBlock /> {/* [!code ++] */}
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

      <RichTextBubbleCodeBlock /> {/* [!code ++] */}

      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```

- You can write ` ``` `, press <kbd>Enter</kbd>, and write some code! It loads the language on the fly.
