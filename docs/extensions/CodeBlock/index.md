---
description: CodeBlock

next:
  text: CodeView
  link: /extensions/CodeView/index.md
---

# CodeBlock

- The `CodeBlock` extension allows you to add code blocks to your editor. It uses [prism-code-editor-lightweight](https://github.com/hunghg255/prism-code-editor-lightweight) for syntax highlighting.

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
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock'; // [!code ++]
// ... other extensions


// Import CSS
import 'reactjs-tiptap-editor/style.css';
import 'prism-code-editor-lightweight/layout.css'; // [!code ++]
import 'prism-code-editor-lightweight/themes/github-dark.css'; // [!code ++]


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
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextCodeBlock /> {/* [!code ++] */}
    </div>
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


- You can write `` ``` ``, press <kbd>Enter</kbd>, and write some code! It loads the language on the fly.
