---
description: Image

next:
  text: ImageGif
  link: /extensions/ImageGif/index.md
---

# Image

- Based on TipTap's Image extension. [@tiptap/extension-image](https://tiptap.dev/docs/editor/extensions/nodes/image)

## Usage


```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor'

// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Extension
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image'; // [!code ++]
// ... other extensions


// Import CSS
import 'reactjs-tiptap-editor/style.css';
import 'react-image-crop/dist/ReactCrop.css'; // [!code ++]

const extensions = [
  // Base Extensions
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  })

  ...
  // Import Extensions Here
  Image.configure({// [!code ++]
    upload: (file: File) => {// [!code ++]
      return new Promise((resolve) => {// [!code ++]
        setTimeout(() => {// [!code ++]
          resolve(URL.createObjectURL(file))// [!code ++]
        }, 500)// [!code ++]
      })// [!code ++]
    },// [!code ++]
  }),// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextImage /> {/* [!code ++] */}
    </div>
  )
}

const App = () => {
   const editor = useEditor({
    textDirection: 'auto', // global text direction
    extensions,
  });

  return (
    <RichTextProvider
      editor={editor}
    >
      <RichTextToolbar />

      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```

## Image Gif

- ImageGif is a node extension that allows you to add an ImageGif to your editor.
- More: [ImageGif](/extensions/ImageGif/index.md)

## Props

```ts
interface IImageOptions extends GeneralOptions<IImageOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>

  HTMLAttributes?: any

  multiple?: boolean
  acceptMimes?: string[]
  maxSize?: number

  /** The source URL of the image */
  resourceImage: 'upload' | 'link' | 'both'
  defaultInline?: boolean,

  enableAlt?: boolean,

  onError?: (error: {
    type: 'size' | 'type' | 'upload';
    message: string;
    file?: File;
  }) => void;
}
```

| Property         | Type                                                                                    | Description                                                                                                           | Required | Default |
| ---------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `upload`         | `(file: File) => Promise<string>`                                                       | Custom image upload function that receives a `File` and returns a Promise with the image URL, suitable for uploading to cloud or local servers. | No       | None    |
| `HTMLAttributes` | `any`                                                                                   | HTML attributes passed to the `<img>` tag, such as `className`, `style`, `alt`, etc.                                | No       | None    |
| `multiple`       | `boolean`                                                                               | Whether to allow selecting and uploading multiple images simultaneously.                                              | No       | `true`  |
| `acceptMimes`    | `string[]`                                                                              | List of allowed image MIME types or file extension restrictions, such as `['image/jpeg', 'image/png']`, `['image/*']`, or `['.png', '.jpg']`, etc. Supports MIME type wildcards and precise file extension restrictions. | No       | Common image types `['image/jpeg', 'image/gif', 'image/png', 'image/jpg']` |
| `maxSize`        | `number`                                                                                | Maximum size limit for a single image (in bytes), triggers `onError` when exceeded.                                  | No       | `5MB`   |
| `resourceImage`  | `'upload' \| 'link' \| 'both'`                                                          | Image source method: - `'upload'`: Upload only - `'link'`: Link only - `'both'`: Both supported                     | Yes      | `both`  |
| `defaultInline`  | `boolean`                                                                               | Whether to insert images as inline elements by default.                                                               | No       | `false` |
| `enableAlt`      | `boolean`                                                                               | Whether to enable alt text editing for images.                                                               | No       | `true` |
| `onError`        | `(error: { type: 'size' \| 'type' \| 'upload'; message: string; file?: File }) => void` | Callback function for upload or validation failures. Contains error type (size, type, upload), error message, and corresponding file. | No       | None    |

### resourceImage Type Description

- `'upload'`: Users can only select local files for upload
- `'link'`: Users can only input image URLs
- `'both'`: Supports both upload and URL methods

### acceptMimes Usage Instructions

Supports three format types:

1. **MIME types**: such as `['image/jpeg', 'image/png']`
2. **Wildcard types**: such as `['image/*']`, matches all image MIME types
3. **Extension types**: such as:

```ts
[
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.svgz', '.xbm',
  '.tiff', '.ico', '.jfif', '.heic', '.heif', '.avif', '.bmp',
  '.apng', '.pjpeg'
]
```

### onError Example

- Customize error handling logic to unify system prompts.
- We recommend using the message field, which has built-in dynamic prompts and i18n internationalization support.

```ts
onError: ({ type, message, file }) => {
  switch (type) {
    case 'size':
      console.warn(`File size exceeds limit: ${file?.name}`);
      break;
    case 'type':
      console.warn(`Unsupported file type: ${file?.type}`);
      break;
    case 'upload':
      console.error(`Upload failed: ${message}`);
      break;
  }
}
```
