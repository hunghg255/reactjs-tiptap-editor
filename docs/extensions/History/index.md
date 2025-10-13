---
description: History

next:
  text: HorizontalRule
  link: /extensions/HorizontalRule/index.md
---

# History

The History extension allows you to undo and redo changes in your editor.

- Based on TipTap's highlight extension. [@tiptap/extension-history](https://www.npmjs.com/package/@tiptap/extension-history)

## Usage

```tsx
import { History } from 'reactjs-tiptap-editor/history'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  History // [!code ++]
];
```

## Options

### shortcutKeys

Type: `string[][]`\
Default: `[['mod', 'Z'], ['shift', 'mod', 'Z']]`

Keyboard shortcuts for the extension.
