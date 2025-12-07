---
description: LineHeight

next:
  text: Link
  link: /extensions/Link/index.md
---

# Line Height

The Line Height extension allows you to change the line height of your text.

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
import { LineHeight, RichTextLineHeight } from 'reactjs-tiptap-editor/lineheight'; // [!code ++]
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
  LineHeight// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextLineHeight /> {/* [!code ++] */}
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

### lineHeights

Type: `string[]`\
Default: `['100%', '115%', '150%', '200%', '250%', '300%']`

```js
import { DEFAULT_LINE_HEIGHT_LIST, LineHeight } from 'reactjs-tiptap-editor/lineheight'

FontSize.configure({
  LineHeight: [
    // Use default line height list
    ...DEFAULT_LINE_HEIGHT_LIST,
    '1',
    '1.5',
    '2',
    '2.5'
  ]
})
```
