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
    upload: (files: File[]) => {// [!code ++]
      const f = files.map(file => ({// [!code ++]
        src: URL.createObjectURL(file),// [!code ++]
        alt: file.name,// [!code ++]
      }))// [!code ++]
      return Promise.resolve(f)// [!code ++]
    },// [!code ++]
  }), // [!code ++]
];
```
