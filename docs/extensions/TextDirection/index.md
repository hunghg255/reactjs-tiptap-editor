---
description: TextDirection
---

## Usage

```tsx
import { TextDirection } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TextDirection // [!code ++]
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
