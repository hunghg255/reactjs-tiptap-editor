---
description: FontSize

next:
  text: FormatPainter
  link: /extensions/FormatPainter/index.md
---

# Font Size

The Font Size extension allows you to change the font size of your editor.

## Usage

```tsx
import { FontSize } from 'reactjs-tiptap-editor/fontsize'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  FontSize // [!code ++]
];
```

## Options

### fontSizes

Type: `(string | { value: string; name: string })[]`

```js
import { DEFAULT_FONT_SIZE_LIST, FontSize } from 'reactjs-tiptap-editor/fontsize'

FontSize.configure({
  fontSizes: [
    // Use default font size list
    ...DEFAULT_FONT_SIZE_LIST,
    // Two formats
    //   1. string
    //   2. { name: 'xxx', value: 'xxx' }

    '10px',
    { name: '200 pixel', value: '200px' }
  ]
})
```
