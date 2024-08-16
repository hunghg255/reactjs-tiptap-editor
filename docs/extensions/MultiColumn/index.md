---
description: MultiColumn

next:
  text: OrderedList
  link: /extensions/OrderedList/index.md
---

## Usage

```tsx
import BaseKit, { ColumnToolbar } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  BaseKit.configure({
    multiColumn: true, // [!code ++]
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  ...,
  // Import Extensions Here
  ColumnToolbar,  // [!code ++]
];

```
