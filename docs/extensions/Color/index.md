---
description: Color

next:
  text: Document
  link: /extensions/Document/index.md
---

# Color

The Color extension allows you to add color to your editor.

- Based on TipTap's Color extension. [@tiptap/extension-text-style](https://tiptap.dev/docs/editor/extensions/functionality/color)

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
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color'; // [!code ++]
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
  Color// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextColor /> {/* [!code ++] */}
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

### colors

Type: `string[]`\
Default: `undefined`

An array of color options to display in the color picker. If not provided, a default set of colors will be used.

```js
import { COLORS_LIST } from 'reactjs-tiptap-editor'
```

### defaultColor

Type: `string`\
Default: `undefined`

```js
import { DEFAULT_COLOR } from 'reactjs-tiptap-editor'
```

### initialDisplayedColor

Type: `string`\
Default: `undefined`

The initial color to be displayed in the action button. If not provided, a default color will be used.
