---
description: CodeBlock

next:
  text: Color
  link: /extensions/Color/index.md
---

# CodeBlock

The `CodeBlock` extension allows you to add code blocks to your editor. It uses [Shiki](https://shiki.style/guide/) for syntax highlighting.

## Usage

```tsx
import { CodeBlock } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  CodeBlock.configure({ defaultTheme: 'dracula' }), // [!code ++]
];
```

- You can write `` ```ts ``, press <kbd>Enter</kbd>, and write some code! It loads the language on the fly.
