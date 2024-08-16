---
description: CodeBlock

next:
  text: Color
  link: /extensions/Color/index.md
---

## Usage

```tsx
import { CodeBlock } from 'reactjs-tiptap-editor'; // [!code ++]

// Import Lowlight and Common to create a highlighter
import { createLowlight, common } from 'lowlight'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  CodeBlock.configure({ lowlight: createLowlight(common) }), // [!code ++]
];

```
