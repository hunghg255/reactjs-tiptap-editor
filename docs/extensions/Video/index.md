---
description: Video
---

# Video

Insert linked or uploaded videos into the document.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Video, RichTextVideo } from 'reactjs-tiptap-editor/video';
import { RichTextBubbleVideo } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

function uploadVideo(
  file: File,
  onProgress?: (progress: { loaded: number; total: number }) => void
) {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const request = new XMLHttpRequest();
    request.open('POST', '/api/videos');
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress?.({ loaded: event.loaded, total: event.total });
      }
    });
    request.addEventListener('load', () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error('Video upload failed'));
        return;
      }

      try {
        const data = JSON.parse(request.responseText);
        if (typeof data.url !== 'string' || !data.url) {
          throw new Error('Upload response must contain a video URL');
        }
        resolve(data.url);
      } catch (error) {
        reject(error);
      }
    });
    request.addEventListener('error', () => reject(new Error('Video upload failed')));
    request.send(formData);
  });
}

const extensions = [
  Document,
  Paragraph,
  Text,
  Video.configure({
    resourceVideo: 'both',
    acceptMimes: ['video/mp4', 'video/webm'],
    maxSize: 100 * 1024 * 1024,
    multiple: true,
    uploadConcurrency: 3,
    showUploadProgress: true,
    upload: (file, { onProgress } = {}) => uploadVideo(file, onProgress),
    onError: ({ message, file }) => {
      console.error(message, file?.name);
    },
  }),
];

export default function VideoExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextVideo />
      <RichTextBubbleVideo />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

The upload example calls your application’s `/api/videos` endpoint, which must return JSON containing a `url` string. For URL-only use without a backend, replace the configuration with `Video.configure({ resourceVideo: "link" })`. Mount `RichTextBubbleVideo` for contextual controls. A hosting provider must permit embedding for its player to work.

## Props

```ts
interface VideoUploadProgress {
  loaded: number;
  total: number;
}

interface VideoUploadContext {
  onProgress?: (progress: VideoUploadProgress) => void;
}

interface VideoOptions extends GeneralOptions<VideoOptions> {
  /**
   * Indicates whether fullscreen play is allowed
   *
   * @default true
   */
  allowFullscreen: boolean;
  /**
   * Indicates whether to display the frameborder
   *
   * @default false
   */
  frameborder: boolean;
  /**
   * Width of the video, can be a number or string
   *
   * @default VIDEO_SIZE['size-medium']
   */
  width: number | string;
  /** HTML attributes object for passing additional attributes */
  HTMLAttributes: {
    [key: string]: any;
  };
  /** Function for uploading files */
  upload?: (file: File, context?: VideoUploadContext) => Promise<string>;

  /** Whether multiple videos can be selected and uploaded at once */
  multiple?: boolean;

  /** Maximum number of videos uploaded concurrently */
  uploadConcurrency?: number;

  /**
   * Whether to display overall and per-file upload progress
   *
   * @default true
   */
  showUploadProgress?: boolean;

  /** Accepted video MIME types or file extensions */
  acceptMimes?: string[];

  /** Maximum size of a single video in bytes. No limit is applied when omitted. */
  maxSize?: number;

  /** Callback invoked when video validation or upload fails */
  onError?: (error: { type: 'size' | 'type' | 'upload'; message: string; file?: File }) => void;

  /** The source URL of the video */
  resourceVideo: 'upload' | 'link' | 'both';

  /**
   * List of allowed video hosting providers.
   * Use ['.'] to allow any URL.
   *
   * @default ['.']
   */
  videoProviders?: string[];
}
```

## Options

| Option               | Type                                                                                    | Description                                                                                        | Required | Default                       |
| -------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| `allowFullscreen`    | `boolean`                                                                               | Allows embedded videos to enter fullscreen mode.                                                   | No       | `true`                        |
| `frameborder`        | `boolean`                                                                               | Displays a border around the embedded video frame.                                                 | No       | `false`                       |
| `width`              | `number \| string`                                                                      | Sets the default video width.                                                                      | No       | `VIDEO_SIZE.size-medium`      |
| `HTMLAttributes`     | `Record<string, any>`                                                                   | Adds HTML attributes to the video wrapper.                                                         | No       | `{ class: 'iframe-wrapper' }` |
| `upload`             | `(file: File, context?: VideoUploadContext) => Promise<string>`                         | Uploads a local video, optionally reports byte progress, and resolves with its URL.                | No       | None                          |
| `multiple`           | `boolean`                                                                               | Allows selecting and uploading multiple videos.                                                    | No       | `true`                        |
| `uploadConcurrency`  | `number`                                                                                | Limits the number of videos uploaded at the same time. Values below `1` are treated as `1`.        | No       | `3`                           |
| `showUploadProgress` | `boolean`                                                                               | Displays overall and per-file progress when byte progress is reported.                             | No       | `true`                        |
| `acceptMimes`        | `string[]`                                                                              | Restricts local files by MIME type or extension; wildcard values such as `video/*` are supported.  | No       | `['video/*']`                 |
| `maxSize`            | `number`                                                                                | Maximum size of each local video in bytes. No size limit is applied when omitted.                  | No       | None                          |
| `onError`            | `(error: { type: 'size' \| 'type' \| 'upload'; message: string; file?: File }) => void` | Handles validation and upload failures. When omitted, the editor displays its default error toast. | No       | None                          |
| `resourceVideo`      | `'upload' \| 'link' \| 'both'`                                                          | Controls whether users can add videos by local upload, URL, or both.                               | No       | `'both'`                      |
| `videoProviders`     | `string[]`                                                                              | Restricts linked videos to matching providers. Use `['.']` to accept any URL.                      | No       | `['.']`                       |

## Upload behavior

The `XMLHttpRequest` example reports uploaded bytes through `onProgress`. A plain `fetch` upload does not provide that byte-progress callback.

While the `upload` promise is pending, both the toolbar dialog and the slash-command dialog stay
open and disable the upload button. Call `context.onProgress({ loaded, total })` to show real,
byte-weighted total progress and per-file progress. If an existing upload function ignores the
optional second argument, it remains compatible and the editor shows an indeterminate spinner.
Progress details are enabled by default. Set `showUploadProgress: false` to hide the overall and
per-file progress UI while keeping the disabled upload button and indeterminate loading indicator.

When all uploads resolve, their URLs are inserted in selection order and the dialog closes. A file
that reaches 100% before its upload promise resolves is shown as processing.

If one upload rejects, other successful videos are still inserted. The failed file remains marked in
the open dialog so the user can select it again. Configure `onError` to provide custom error handling;
otherwise, the editor shows its default upload error toast.

`acceptMimes` and `maxSize` validate every selected file before uploading. With `multiple: true`, all
valid files are queued and up to `uploadConcurrency` files upload at once.
