---
description: Image

next:
  text: Indent
  link: /extensions/Indent/index.md
---

# Image

- Based on TipTap's Image extension. [@tiptap/extension-image](https://tiptap.dev/docs/editor/extensions/nodes/image)

## Usage

```tsx
import { Image } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Image.configure({// [!code ++]
    upload: (files: File) => {// [!code ++]
      return new Promise((resolve) => {// [!code ++]
        setTimeout(() => {// [!code ++]
          resolve(URL.createObjectURL(files))// [!code ++]
        }, 500)// [!code ++]
      })// [!code ++]
    },// [!code ++]
  }),// [!code ++]
];
```

## Image Gif

- ImageGif is a node extension that allows you to add an ImageGif to your editor.
- More: [ImageGif](/extensions/ImageGif/index.md)
