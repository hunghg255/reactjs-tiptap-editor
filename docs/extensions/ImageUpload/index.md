---
description: ImageUpload

next:
  text: Indent
  link: /extensions/Indent/index.md
---

# ImageUpload

- Handles uploading images to the editor.

## Usage

```tsx
import { ImageUpload } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  ImageUpload.configure({// [!code ++]
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

## Props

- `upload` - A function that returns a promise that resolves to the image URL.
- `postUpload` - A function that is called after the image is uploaded. It receives the image URL as an argument.
