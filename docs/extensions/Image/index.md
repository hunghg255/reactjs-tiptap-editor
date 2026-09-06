---
description: Image

next:
  text: ImageGif
  link: /extensions/ImageGif/index.md
---

# Image

Insert images from a URL or an application-provided upload service.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import { RichTextBubbleImage } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Image.configure({ resourceImage: 'link' })];

export default function ImageExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextImage />
      <RichTextBubbleImage />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

The example starts in URL-only mode so it works without a backend. To enable local files, configure `resourceImage: "both"` or `"upload"` and provide `upload: (file: File) => Promise<string>`. Return a durable image URL; temporary `blob:` URLs will not survive a reload. Mount `RichTextBubbleImage` for image editing controls.

## Inline and block images

`Image.configure()` now registers both image node types used by the editor:

- `image`: the legacy inline node, kept for existing ProseMirror JSON compatibility.
- `imageBlock`: a block-level node used when `defaultInline` is `false` or when `setImageInline({ inline: false })` / `setImageBlock()` inserts an image.

Existing HTML is still accepted:

- `<div class="image"><img ... /></div>` is parsed as `imageBlock`.
- `<span class="image"><img inline="true" ... /></span>` is parsed as the inline `image` node.
- Old JSON with `type: "image"` continues to load. If you want to migrate stored JSON, use `migrateImageJSONToImageBlock(json)` before saving the migrated document.

## Image Gif

To search a GIF provider and insert a result, use the separate [ImageGif extension](/extensions/ImageGif/index.md).

## Props

```ts
interface IImageOptions extends GeneralOptions<IImageOptions> {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>;

  HTMLAttributes?: any;

  multiple?: boolean;
  acceptMimes?: string[];
  maxSize?: number;

  /** The source URL of the image */
  resourceImage: 'upload' | 'link' | 'both';
  defaultInline?: boolean;

  enableAlt?: boolean;

  onError?: (error: { type: 'size' | 'type' | 'upload'; message: string; file?: File }) => void;
}
```

| Property         | Type                                                                                    | Description                                                                                                                                                                                                              | Required | Default                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------- |
| `upload`         | `(file: File) => Promise<string>`                                                       | Custom image upload function that receives a `File` and returns a Promise with the image URL, suitable for uploading to cloud or local servers.                                                                          | No       | None                                                                       |
| `HTMLAttributes` | `any`                                                                                   | HTML attributes passed to the `<img>` tag, such as `className`, `style`, `alt`, etc.                                                                                                                                     | No       | None                                                                       |
| `multiple`       | `boolean`                                                                               | Whether to allow selecting and uploading multiple images simultaneously.                                                                                                                                                 | No       | `true`                                                                     |
| `acceptMimes`    | `string[]`                                                                              | List of allowed image MIME types or file extension restrictions, such as `['image/jpeg', 'image/png']`, `['image/*']`, or `['.png', '.jpg']`, etc. Supports MIME type wildcards and precise file extension restrictions. | No       | Common image types `['image/jpeg', 'image/gif', 'image/png', 'image/jpg']` |
| `maxSize`        | `number`                                                                                | Maximum size limit for a single image (in bytes), triggers `onError` when exceeded.                                                                                                                                      | No       | `5MB`                                                                      |
| `resourceImage`  | `'upload' \| 'link' \| 'both'`                                                          | Image source method: - `'upload'`: Upload only - `'link'`: Link only - `'both'`: Both supported                                                                                                                          | No       | `both`                                                                     |
| `defaultInline`  | `boolean`                                                                               | Whether to insert images as inline elements by default.                                                                                                                                                                  | No       | `false`                                                                    |
| `enableAlt`      | `boolean`                                                                               | Whether to enable alt text editing for images.                                                                                                                                                                           | No       | `true`                                                                     |
| `onError`        | `(error: { type: 'size' \| 'type' \| 'upload'; message: string; file?: File }) => void` | Callback function for upload or validation failures. Contains error type (size, type, upload), error message, and corresponding file.                                                                                    | No       | None                                                                       |

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
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.svgz',
  '.xbm',
  '.tiff',
  '.ico',
  '.jfif',
  '.heic',
  '.heif',
  '.avif',
  '.bmp',
  '.apng',
  '.pjpeg',
];
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
};
```

## Upload a local image

Replace the URL-only configuration in the setup example with this one. Implement `/api/images` in your application so it accepts a multipart `file` and returns a JSON object with a `url` string:

```ts
Image.configure({
  resourceImage: 'both',
  upload: async (file: File): Promise<string> => {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch('/api/images', { method: 'POST', body });
    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    if (typeof data.url !== 'string' || !data.url) {
      throw new Error('Upload response must contain an image URL');
    }
    return data.url;
  },
});
```

The library handles the editor UI; your application supplies storage and the upload endpoint. Enforce accepted file types and size limits on that endpoint as well as in the client configuration.
