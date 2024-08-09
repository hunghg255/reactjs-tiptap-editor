---
description: Code Block

next:
  text: Text Color
  link: /extensions/color/text-color.md
---

## Install

```
npm install lowlight
```

## Usage

```tsx
import BaseKit, { CodeBlock } from 'reactjs-tiptap-editor'; // [!code ++]

// Import Lowlight and Common to create a highlighter
import { createLowlight, common } from 'lowlight'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  CodeBlock.configure({ lowlight: createLowlight(common) }), // [!code ++]
];

```
