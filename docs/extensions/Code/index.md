---
description: Code

next:
  text: CodeBlock
  link: /extensions/CodeBlock/index.md
---

# Code

The Code extension allows you to add code to your editor.

- Based on TipTap's Code extension. [@tiptap/extension-code](https://tiptap.dev/docs/editor/extensions/marks/code)

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
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code'; // [!code ++]
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
  Code// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextCode /> {/* [!code ++] */}
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


## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'E']`

Keyboard shortcuts for the extension.
