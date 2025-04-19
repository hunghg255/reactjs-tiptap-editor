---
description: ListItem

next:
  text: MoreMark
  link: /extensions/MoreMark/index.md
---

# List Item

ListItem is a node extension that allows you to add a list item to your editor.

- Based on TipTap's Link extension. [@tiptap/extension-link](https://tiptap.dev/docs/editor/extensions/marks/link)

Usage

```tsx
import { ListItem } from 'reactjs-tiptap-editor/listitem'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  ListItem // [!code ++]
];
```
