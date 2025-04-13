---
description: CodeBlock

next:
  text: Color
  link: /extensions/Color/index.md
---

# CodeBlock

- Based on TipTap's CodeBlock extension. [@tiptap/extension-code-block](https://tiptap.dev/docs/editor/extensions/nodes/code-block)

- The `CodeBlock` extension allows you to add code blocks to your editor. It uses [prism-code-editor](https://prism-code-editor.netlify.app/) for syntax highlighting.

## Usage

```tsx
import { CodeBlock } from 'reactjs-tiptap-editor/extension-bundle'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  CodeBlock, // [!code ++]
];
```

- You can write `` ``` ``, press <kbd>Enter</kbd>, and write some code! It loads the language on the fly.
