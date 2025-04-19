---
description: MoreMark

next:
  text: MultiColumn
  link: /extensions/MultiColumn/index.md
---

# More Mark

 MoreMark is a collection of marks that are not available in the default TipTap editor.

- Based on TipTap's subscript [@tiptap/extension-subscript](https://tiptap.dev/docs/editor/extensions/marks/subscript) and superscript [@tiptap/extension-superscript](https://tiptap.dev/docs/editor/extensions/marks/superscript) extensions.

## Usage

```tsx
import { MoreMark } from 'reactjs-tiptap-editor/moremark'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  MoreMark // [!code ++]
];
```
