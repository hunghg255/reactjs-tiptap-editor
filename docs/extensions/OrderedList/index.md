---
description: OrderedList

next:
  text: Selection
  link: /extensions/Selection/index.md
---

# Ordered List

Ordered List extension allows you to create ordered lists in your editor.

- Based on TipTap's ordered-list [@tiptap/extension-ordered-list](https://tiptap.dev/docs/editor/extensions/nodes/ordered-list) extensions.

## Usage

```tsx
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  OrderedList // [!code ++]
];
```
