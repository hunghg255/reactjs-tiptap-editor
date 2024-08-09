---
description: Text Alignment

next:
  text: Clear Format
  link: /extensions/clear/clear-format.md
---

# Usage

```tsx
import BaseKit, { TextAlign } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TextAlign.configure({ types: ['heading', 'paragraph'] }), // [!code ++]
];

```
