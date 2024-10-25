---
description: Video

next:
  text: SearchAndReplace
  link: /extensions/SearchAndReplace/index.md
---

# Video

The Video extension allows you to add a video to your editor.

## Usage

```tsx
import { Video } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Video.configure({// [!code ++]
    upload: (files: File) => {// [!code ++]
      return new Promise((resolve) => {// [!code ++]
        setTimeout(() => {// [!code ++]
          resolve(URL.createObjectURL(files))// [!code ++]
        }, 500)// [!code ++]
      })// [!code ++]
    },// [!code ++]
  }), // [!code ++]
];
```
