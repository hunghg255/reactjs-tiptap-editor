---
description: Video
---

# Video

The Video extension allows you to add a video to your editor.

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
import { Video, RichTextVideo } from 'reactjs-tiptap-editor/video'; // [!code ++]
// ... other extensions


// Import CSS
import 'reactjs-tiptap-editor/style.css';

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
  Video.configure({// [!code ++]
    resourceVideo: 'both',// [!code ++]
    acceptMimes: ['video/mp4', 'video/webm'],// [!code ++]
    maxSize: 100 * 1024 * 1024,// [!code ++]
    multiple: false,// [!code ++]
    upload: async (file) => {// [!code ++]
      const formData = new FormData();// [!code ++]
      formData.append('file', file);// [!code ++]
// [!code ++]
      const response = await fetch('/api/videos', {// [!code ++]
        method: 'POST',// [!code ++]
        body: formData,// [!code ++]
      });// [!code ++]
// [!code ++]
      if (!response.ok) {// [!code ++]
        throw new Error('Video upload failed');// [!code ++]
      }// [!code ++]
// [!code ++]
      const { url } = await response.json();// [!code ++]
      return url;// [!code ++]
    },// [!code ++]
    onError: ({ message, file }) => {// [!code ++]
      console.error(message, file?.name);// [!code ++]
    },// [!code ++]
  })// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <RichTextVideo /> {/* [!code ++] */}
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

## Props

```ts
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
  upload?: (file: File) => Promise<string>;

  /** Whether multiple videos can be selected and uploaded at once */
  multiple?: boolean;

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

| Option            | Type                                                                                    | Description                                                                                        | Required | Default                       |
| ----------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| `allowFullscreen` | `boolean`                                                                               | Allows embedded videos to enter fullscreen mode.                                                   | No       | `true`                        |
| `frameborder`     | `boolean`                                                                               | Displays a border around the embedded video frame.                                                 | No       | `false`                       |
| `width`           | `number \| string`                                                                      | Sets the default video width.                                                                      | No       | `VIDEO_SIZE.size-medium`      |
| `HTMLAttributes`  | `Record<string, any>`                                                                   | Adds HTML attributes to the video wrapper.                                                         | No       | `{ class: 'iframe-wrapper' }` |
| `upload`          | `(file: File) => Promise<string>`                                                       | Uploads a local video and resolves with the URL inserted into the editor.                          | No       | None                          |
| `multiple`        | `boolean`                                                                               | Allows selecting and uploading multiple videos.                                                    | No       | `true`                        |
| `acceptMimes`     | `string[]`                                                                              | Restricts local files by MIME type or extension; wildcard values such as `video/*` are supported.  | No       | `['video/*']`                 |
| `maxSize`         | `number`                                                                                | Maximum size of each local video in bytes. No size limit is applied when omitted.                  | No       | None                          |
| `onError`         | `(error: { type: 'size' \| 'type' \| 'upload'; message: string; file?: File }) => void` | Handles validation and upload failures. When omitted, the editor displays its default error toast. | No       | None                          |
| `resourceVideo`   | `'upload' \| 'link' \| 'both'`                                                          | Controls whether users can add videos by local upload, URL, or both.                               | No       | `'both'`                      |
| `videoProviders`  | `string[]`                                                                              | Restricts linked videos to matching providers. Use `['.']` to accept any URL.                      | No       | `['.']`                       |

## Upload behavior

While the `upload` promise is pending, both the toolbar dialog and the slash-command dialog stay
open, disable the upload button, and show a localized loading indicator. When the promise resolves,
the returned URL is inserted into the editor and the dialog closes.

If the promise rejects, no video is inserted. The dialog remains open so the user can retry the same
file. Configure `onError` to provide custom error handling; otherwise, the editor shows its default
upload error toast.

`acceptMimes` and `maxSize` validate every selected file before uploading. With `multiple: true`, all
valid files upload in parallel and are inserted in selection order after every upload succeeds.
