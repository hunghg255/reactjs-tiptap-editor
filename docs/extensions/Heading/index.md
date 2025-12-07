---
description: Heading

next:
  text: Highlight
  link: /extensions/Highlight/index.md
---

# Heading

The Heading extension allows you to add a heading to your editor.

- Based on TipTap's heading extension. [@tiptap/extension-heading](https://tiptap.dev/docs/editor/extensions/nodes/heading)

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
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading'; // [!code ++]
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
  Heading// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextHeading /> {/* [!code ++] */}
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

Type: `string[][]`\
Default: `['alt', 'mod', '${level}']`

Keyboard shortcuts for the extension. To override shortcuts for different heading levels:

```tsx
Heading.configure({
  shortcutKeys: [
    ['alt', 'mod', '0'],
    ['alt', 'mod', '1'],
    ['alt', 'mod', '2'],
    ['alt', 'mod', '3'],
    ['alt', 'mod', '4'],
    ['alt', 'mod', '5'],
    ['alt', 'mod', '6'],
    ...
  ]
});
```
