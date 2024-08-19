---
description: VideoUpload

next:
  text: SearchAndReplace
  link: /extensions/SearchAndReplace/index.md
---

## Usage

```tsx
import { VideoUpload } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
   VideoUpload.configure({// [!code ++]
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
