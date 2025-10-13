---
description: Italic

next:
  text: LineHeight
  link: /extensions/LineHeight/index.md
---

# Italic

- Based on TipTap's Italic extension. [@tiptap/extension-italic](https://tiptap.dev/docs/editor/extensions/marks/italic)

## Usage

```tsx
import { Italic } from 'reactjs-tiptap-editor/italic'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Italic // [!code ++]
];
```

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'I']`

Keyboard shortcuts for the extension.
