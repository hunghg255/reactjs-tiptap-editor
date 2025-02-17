---
description: Katex

next:
  text: ExportPdf
  link: /extensions/ExportPdf/index.md
---

# Katex

- Katex Extension for Tiptap Editor.
- This extension allows you to add Katex math equations to your editor.
- Supports inline and block math equations.
- This extension is based on [katex](https://katex.org/).

## Usage

```tsx

import 'katex/dist/katex.min.css'; // [!code ++]
import { Katex } from 'reactjs-tiptap-editor/extension-bundle'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
   Katex, // [!code ++]
];
```
