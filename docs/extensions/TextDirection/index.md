---
description: TextDirection

next:
  text: Mention
  link: /extensions/Mention/index.md
---

# Text Direction

The Text Direction extension allows you to change the text direction of your editor.

## Usage

```tsx
import { TextDirection } from 'reactjs-tiptap-editor/extension-bundle'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TextDirection // [!code ++]
];
```

## Configuration

```tsx
import { TextDirection } from 'reactjs-tiptap-editor/textdirection'; // [!code ++]

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
