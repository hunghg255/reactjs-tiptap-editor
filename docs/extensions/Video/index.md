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
import { Video } from 'reactjs-tiptap-editor/video'; // [!code ++]

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

## Props

```ts
interface VideoOptions extends GeneralOptions<VideoOptions> {
  /**
   * Indicates whether fullscreen play is allowed
   *
   * @default true
   */
  allowFullscreen: boolean
  /**
   * Indicates whether to display the frameborder
   *
   * @default false
   */
  frameborder: boolean
  /**
   * Width of the video, can be a number or string
   *
   * @default VIDEO_SIZE['size-medium']
   */
  width: number | string
  /** HTML attributes object for passing additional attributes */
  HTMLAttributes: {
    [key: string]: any
  }
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>

  /** The source URL of the video */
  resourceVideo: 'upload' | 'link' | 'both'
}
```
