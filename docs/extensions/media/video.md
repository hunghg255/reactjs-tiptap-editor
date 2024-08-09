---
description: Video

next:
  text: Table
  link: /extensions/table/index.md
---

## Usage

```tsx
import BaseKit, { Video, VideoUpload } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Video,  // [!code ++]
  VideoUpload.configure({  // [!code ++]
    upload: (files: File[]) => { // [!code ++]
      // Upload video to server // [!code ++]
      const f = files.map((file) => ({ // [!code ++]
        src: URL.createObjectURL(file), // [!code ++]
        alt: file.name, // [!code ++]
      })); // [!code ++]
      return Promise.resolve(f); // [!code ++]
    }, // [!code ++]
  }), // [!code ++]
];

```
