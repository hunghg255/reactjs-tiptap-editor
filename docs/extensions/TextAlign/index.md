---
description: TextAlign

next:
  text: TextBubble
  link: /extensions/TextBubble/index.md
---

# Text Align

 The Text Align extension allows you to align text in the editor.

- Based on TipTap's task list extension. [@tiptap/extension-text-align](https://tiptap.dev/docs/editor/extensions/functionality/textalign)

## Usage

```tsx
import { TextAlign } from 'reactjs-tiptap-editor/textalign'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TextAlign // [!code ++]
];
```

## Options

### shortcutKeys

Type: `string[][]`\
Default: `[['mod', 'shift', 'L'], ['mod', 'shift', 'E'], ['mod', 'shift', 'R'], ['mod', 'shift', 'J']]`

Keyboard shortcuts for the extension (left, center, right & justify).
