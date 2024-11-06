---
description: Mermaid

next:
  text: Twitter
  link: /extensions/Twitter/index.md
---

# Mermaid

Mermaid is a node extension that allows you to add an Mermaid to your editor.

- [Mermaid](https://mermaid.js.org/)

## Usage

```tsx
import { Mermaid } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Mermaid.configure({// [!code ++]
    upload: (file: any) => {// [!code ++]
      // upload file to server return url
    },// [!code ++]
  }),// [!code ++]
];
```
