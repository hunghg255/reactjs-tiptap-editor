---
description: CodeView

next:
  text: Color
  link: /extensions/Color/index.md
---

# CodeView

- The `CodeView` extension allows you view html code of the editor.

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
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview'; // [!code ++]
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
  CodeView// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextCodeView /> {/* [!code ++] */}
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


