---
description: CodeBlock

next:
  text: Color
  link: /extensions/Color/index.md
---

# CodeBlock

- The `CodeBlock` extension allows you to add code blocks to your editor. It uses [prism-code-editor-lightweight](https://github.com/hunghg255/prism-code-editor-lightweight) for syntax highlighting.

## Usage

```tsx
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock'; // [!code ++]

import 'prism-code-editor-lightweight/layout.css'; // [!code ++]
import 'prism-code-editor-lightweight/themes/github-dark.css'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  CodeBlock, // [!code ++]
];
```

- You can write `` ``` ``, press <kbd>Enter</kbd>, and write some code! It loads the language on the fly.
