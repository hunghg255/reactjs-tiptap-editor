---
description: Import Word

next:
  text: ExportWord
  link: /extensions/ExportWord/index.md
---

# Import Word

- Import Word Extension for Tiptap Editor.

## Usage

::: code-group

```sh [npm]
npm install mammoth
```

```sh [pnpm]
pnpm install mammoth
```

```sh [yarn]
yarn add mammoth
```

:::

```tsx
import { ImportWord } from 'reactjs-tiptap-editor/importword'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
   ImportWord, // [!code ++]
];
```
