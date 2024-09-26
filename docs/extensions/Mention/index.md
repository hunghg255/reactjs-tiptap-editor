---
description: Mention
---

## Usage

```tsx
import { Mention } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Mention // [!code ++]
];
```

## Configuration

```tsx
import { TextDirection } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TextDirection.configure({ // [!code ++]
    types: ['heading', 'paragraph', 'blockquote', 'list_item'], // [!code ++]
    directions: ['ltr', 'rtl'], // [!code ++]
    defaultDirection: 'ltr', // [!code ++]
  }) // [!code ++]
];
```
