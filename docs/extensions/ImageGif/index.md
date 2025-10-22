---
description: ImageGif

next:
  text: Mermaid
  link: /extensions/Mermaid/index.md
---

# ImageGif

ImageGif is a node extension that allows you to add an ImageGif to your editor.

## Usage

```tsx
import { ImageGif } from 'reactjs-tiptap-editor/imagegif'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  ImageGif.configure({// [!code ++]
    API_KEY: '', // [!code ++]
    provider: 'tenor' // [!code ++] (tenor or giphy)
  }),// [!code ++]
];
```

- `API_KEY` -  You can get it from [Giphy Developers](https://developers.giphy.com/) or  [Tenor Developers](https://tenor.com/)
