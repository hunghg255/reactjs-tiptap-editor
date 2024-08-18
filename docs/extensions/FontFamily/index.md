---
description: FontFamily

next:
  text: FontSize
  link: /extensions/FontSize/index.md
---

## Usage

```tsx
import { FontFamily } from 'reactjs-tiptap-editor'; // [!code ++]

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
import { DEFAULT_FONT_FAMILY_LIST, FontFamily } from 'reactjs-tiptap-editor';

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
