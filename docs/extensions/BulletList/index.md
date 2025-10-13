---
description: BulletList

next:
  text: Clear
  link: /extensions/Clear/index.md
---

# BulletList

The BulletList extension allows you to add bullet lists to your editor.

- Based on TipTap's Bold extension. [@tiptap/bullet-list](https://tiptap.dev/docs/editor/extensions/nodes/bullet-list)

## Usage

```tsx
import { BulletList } from 'reactjs-tiptap-editor/bulletlist'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  BulletList // [!code ++]
];
```

## Options

### shortcutKeys

Type: `string[]`\
Default: `['shift', 'mod', '8']`

Keyboard shortcuts for the extension.
