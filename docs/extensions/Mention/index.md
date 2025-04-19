---
description: Mention

next:
  text: Attachment
  link: /extensions/Attachment/index.md
---

# Mention

Mention is a node extension that allows you to add a Mention to your editor.

- Based on TipTap's Link extension. [@tiptap/extension-mention](https://tiptap.dev/docs/editor/extensions/nodes/mention)

## Usage

```tsx
import { Mention } from 'reactjs-tiptap-editor/mention'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Mention // [!code ++]
];
```
