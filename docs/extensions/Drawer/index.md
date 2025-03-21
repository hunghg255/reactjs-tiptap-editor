---
description: Drawer
---

# Drawer

Drawer is a node extension that allows you to add an Drawer to your editor.

- [Drawer](https://easydrawer.vercel.app/)

## Usage

```tsx
import { Drawer } from 'reactjs-tiptap-editor/extension-bundle'; // [!code ++]
import 'easydrawer/styles.css'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Drawer.configure({// [!code ++]
    upload: (file: any) => {// [!code ++]
      // upload file to server return url
    },// [!code ++]
  }),// [!code ++]
];
```
