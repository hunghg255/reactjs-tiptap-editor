---
description: FontFamily

next:
  text: FontSize
  link: /extensions/FontSize/index.md
---

# Font Family

The Font Family extension allows you to change the font family of your editor.

- Based on TipTap's font family extension. [@tiptap/extension-font-family](https://tiptap.dev/docs/editor/extensions/functionality/fontfamily)

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
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily'; // [!code ++]
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
  FontFamily// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextFontFamily /> {/* [!code ++] */}
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

### fontFamilyList

Type: `(string | { value: string; name: string })[]`

Set the font list, supporting two formats:

```js
import { DEFAULT_FONT_FAMILY_LIST, FontFamily } from 'reactjs-tiptap-editor/fontfamily'

FontFamily.configure({
  fontFamilyList: [
    // Use default font list
    ...DEFAULT_FONT_FAMILY_LIST,
    // Two formats
    //   1. string
    //   2. { name: 'xxx', value: 'xxx' }

    '黑体',
    '楷体',
    { name: '仿宋', value: '仿宋' },
    'Arial',
    'Tahoma',
    'Verdana'
  ]
})
```
