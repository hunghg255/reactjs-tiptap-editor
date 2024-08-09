---
description: Image

next:
  text: Video
  link: /extensions/media/video.md
---

## Usage

```tsx
import BaseKit, { Image, ImageUpload } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Image,  // [!code ++]
  ImageUpload.configure({  // [!code ++]
    upload: (files: File) => {  // [!code ++]
      // Upload image to server  // [!code ++]
      return new Promise((resolve) => {  // [!code ++]
        setTimeout(() => {  // [!code ++]
          resolve(URL.createObjectURL(files));  // [!code ++]
        }, 500);  // [!code ++]
      });  // [!code ++]
    },  // [!code ++]
  }), // [!code ++]
];

```
