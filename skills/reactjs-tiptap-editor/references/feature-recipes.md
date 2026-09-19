# Feature Recipes

Load the relevant section for features beyond the base editor. Snippets extend the quickstart's `baseExtensions`; compose selected extensions into one array rather than replacing it with each recipe. Render controls inside the provider after the null guard. App-specific data and callbacks are identified below.

## Toolbar Pattern

1. Add the extension to `extensions`.
2. Render the matching `RichText*` component inside `RichTextProvider`.

```tsx
import { History, RichTextRedo, RichTextUndo } from 'reactjs-tiptap-editor/history';

const extensions = [...baseExtensions, History];

function Toolbar() {
  return (
    <div className='flex flex-wrap items-center gap-2 border-b'>
      <RichTextUndo />
      <RichTextRedo />
    </div>
  );
}
```

## Bubble Menu Pattern

Bubble components must render inside `RichTextProvider`; most require their matching extension.

```tsx
import { RichTextBubbleCodeBlock } from 'reactjs-tiptap-editor/bubble/codeblock';
import { RichTextBubbleImage } from 'reactjs-tiptap-editor/bubble/media';
import { RichTextBubbleLink } from 'reactjs-tiptap-editor/bubble/link';
import { RichTextBubbleMenuDragHandle } from 'reactjs-tiptap-editor/bubble/drag-handle';
import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble/text';

function BubbleMenus() {
  return (
    <>
      <RichTextBubbleText />
      <RichTextBubbleLink />
      <RichTextBubbleImage />
      <RichTextBubbleCodeBlock />
      <RichTextBubbleMenuDragHandle />
    </>
  );
}
```

## Slash Command

```tsx
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';

const extensions = [...baseExtensions, SlashCommand];

// Render inside RichTextProvider:
<SlashCommandList />;
```

Optionally add `Placeholder` from `@tiptap/extensions` with `placeholder: "Press '/' for commands"`. Check that the commands offered by the list have their required extensions enabled.

## Image Upload

Keep the upload contract, transport adapter, and feature composition separate. The following blocks are app-owned code, not additional exports from the package.

Install and import crop CSS when using the image UI:

```bash
pnpm add react-image-crop
```

Define the consumer's narrow contract in `upload-image.ts`:

```ts
// Resolves a persistent media URL; rejects on failure.
export type UploadImage = (file: File) => Promise<string>;
```

Implement the app's transport in `http-image-upload.ts`:

```ts
import type { UploadImage } from './upload-image';

export function createHttpImageUpload(endpoint: string): UploadImage {
  return async (file) => {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch(endpoint, { method: 'POST', body });
    if (!response.ok) throw new Error(`Image upload failed: ${response.status}`);

    const data: unknown = await response.json();
    if (
      typeof data !== 'object' || data === null || !('url' in data) ||
      typeof data.url !== 'string' || !data.url.trim()
    ) {
      throw new Error('Image upload returned no URL');
    }
    const url = data.url.trim();
    // This example contract accepts absolute HTTP(S) media URLs only.
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('Image upload returned an unsupported URL');
    }
    return url;
  };
}
```

Consume the callback in `image-feature.ts`:

```ts
import { Image } from 'reactjs-tiptap-editor/image';
import type { UploadImage } from './upload-image';

export function createImageExtension(upload: UploadImage) {
  return Image.configure({
    upload,
    resourceImage: 'both',
    enableAlt: true,
  });
}
```

Wire the adapter in app composition, alongside the quickstart's `baseExtensions`:

```tsx
import { RichTextImage } from 'reactjs-tiptap-editor/image';
import { createHttpImageUpload } from './http-image-upload';
import { createImageExtension } from './image-feature';
import 'react-image-crop/dist/ReactCrop.css';

const uploadImage = createHttpImageUpload('/api/uploads/images');
const extensions = [...baseExtensions, createImageExtension(uploadImage)];

// Render inside RichTextProvider:
<RichTextImage />;
```

Relevant options: `upload`, `HTMLAttributes`, `multiple`, `acceptMimes`, `maxSize`, `resourceImage`, `defaultInline`, `enableAlt`, `onError`.

`/api/uploads/images` is an example contract, not an endpoint provided by the package. Adapt authentication and response mapping in the adapter to the app's real service. URL validation cannot establish durability: the service must guarantee that stored content can reopen the URL; temporary signed URLs need the app's durable media strategy. Preserve an existing contract that allows relative URLs instead of silently imposing this example's stricter format.

Module-level composition fits static configuration. If credentials or callbacks change during an editor's lifetime, use the app's current-callback mechanism or a supported option update path. Verify the editor sees updated values without recreating it per render; a new memoized extension array alone does not establish this. These helpers can share a small module when cohesive.

## Video, Attachment, Mermaid, Drawer Uploads

These features also accept upload callbacks in repo examples. Return a `Promise<string>` URL.

```tsx
import { Video } from 'reactjs-tiptap-editor/video';
import { Attachment } from 'reactjs-tiptap-editor/attachment';
import { Mermaid } from 'reactjs-tiptap-editor/mermaid';
import { Drawer } from 'reactjs-tiptap-editor/drawer';

Video.configure({ upload: async (file: File) => uploadFile(file) });
Attachment.configure({ upload: async (file: File) => uploadFile(file) });
Mermaid.configure({ upload: async (file: File) => uploadFile(file) });
Drawer.configure({ upload: async (file: File) => uploadFile(file) });
```

`uploadFile` is supplied by the app and must reject failed uploads. Add the configured extension to the editor's array; calling `.configure()` alone does not register it.

## Mention

```tsx
import { Mention } from 'reactjs-tiptap-editor/mention';

// Replace these demo records with the app's data source.
const users = [{ id: 'user-1', label: 'Alex' }];
const tags = [{ id: 'tag-1', label: 'Planning' }];

const extensions = [
  ...baseExtensions,
  Mention.configure({
    suggestions: [
      {
        char: '@',
        items: async ({ query }: { query: string }) =>
          users.filter((user) => user.label.toLowerCase().startsWith(query.toLowerCase())),
      },
      {
        char: '#',
        items: async ({ query }: { query: string }) =>
          tags.filter((tag) => tag.label.toLowerCase().startsWith(query.toLowerCase())),
      },
    ],
  }),
];
```

## Code Block

```tsx
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { RichTextBubbleCodeBlock } from 'reactjs-tiptap-editor/bubble/codeblock';

const extensions = [...baseExtensions, CodeBlock];
```

Render `<RichTextCodeBlock />` in the toolbar and, if requested, `<RichTextBubbleCodeBlock />` inside the provider.

## Export PDF

```tsx
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';

const extensions = [
  ...baseExtensions,
  ExportPdf.configure({
    paperSize: 'A4',
    margins: {
      top: '1in',
      right: '0.4in',
      bottom: '1in',
      left: '0.4in',
    },
  }),
];
```

## Export Word

```tsx
import { ExportWord, RichTextExportWord } from 'reactjs-tiptap-editor/exportword';

const extensions = [...baseExtensions, ExportWord];
```

## Internationalization

```tsx
import { en, localeActions, useLocale } from 'reactjs-tiptap-editor/locale';
import vi from 'reactjs-tiptap-editor/locales/vi';

localeActions.setMessage('vi', vi);
localeActions.setLang('vi');

localeActions.setMessage('en', {
  ...en,
  'editor.remove': 'Delete',
});

function LocaleDebug() {
  const { lang } = useLocale();
  return null;
}
```

Run registration in app initialization, not repeatedly during component render. `/locale` includes English; register other dictionaries before selecting them. For compatibility, `/locale-bundle` registers all bundled languages as an import side effect.

Language keys differ from some file names: `zh_CN` uses `/locales/zh-cn`, `pt_BR` uses `/locales/pt-br`, and `hu_HU` uses `/locales/hu`. Other keys/files are `en`, `vi`, `fi`, and `ja`.

## Theme

```tsx
import { themeActions, useTheme } from 'reactjs-tiptap-editor/theme';

themeActions.setTheme('light'); // or 'dark'
themeActions.setColor('default'); // "red" | "blue" | "green" | "orange" | "rose" | "violet" | "yellow"
themeActions.setBorderRadius('0.5rem');

function ThemeState() {
  const { theme, color, borderRadius } = useTheme();
  return null;
}
```

The current provider accepts but ignores `dark`; synchronize the app's theme through `themeActions.setTheme(...)` in initialization, an event handler, or an effect. Theme and locale actions update shared stores, not per-editor state.
