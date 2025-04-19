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
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  FontFamily // [!code ++]
];
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
