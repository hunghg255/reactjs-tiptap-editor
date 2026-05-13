# Feature Recipes

Load this for requested features beyond the base editor.

## Toolbar Pattern

1. Add the extension to `extensions`.
2. Render the matching `RichText*` component inside `RichTextProvider`.

```tsx
import { History, RichTextRedo, RichTextUndo } from 'reactjs-tiptap-editor/history';

const extensions = [...baseExtensions, History];

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b">
      <RichTextUndo />
      <RichTextRedo />
    </div>
  );
}
```

## Bubble Menu Pattern

Bubble components must render inside `RichTextProvider`; most require their matching extension.

```tsx
import {
  RichTextBubbleCodeBlock,
  RichTextBubbleImage,
  RichTextBubbleLink,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleText,
} from 'reactjs-tiptap-editor/bubble';

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

Use placeholder text such as `Press '/' for commands` in `Placeholder.configure`.

## Image Upload

Install and import crop CSS when using the image UI:

```bash
pnpm add react-image-crop
```

```tsx
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import 'react-image-crop/dist/ReactCrop.css';

const extensions = [
  ...baseExtensions,
  Image.configure({
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/uploads/images', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as { url: string };
      return data.url;
    },
    resourceImage: 'both',
    enableAlt: true,
  }),
];
```

Relevant options: `upload`, `HTMLAttributes`, `multiple`, `acceptMimes`, `maxSize`, `resourceImage`, `defaultInline`, `enableAlt`, `onError`.

## Video, Attachment, Mermaid, Drawer Uploads

These features also accept upload callbacks in repo examples. Return a `Promise<string>` URL.

```tsx
Video.configure({ upload: async (file: File) => uploadFile(file) });
Attachment.configure({ upload: async (file: File) => uploadFile(file) });
Mermaid.configure({ upload: async (file: File) => uploadFile(file) });
Drawer.configure({ upload: async (file: File) => uploadFile(file) });
```

## Mention

```tsx
import { Mention } from 'reactjs-tiptap-editor/mention';

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

## CodeBlock With Lowlight

```bash
pnpm add highlight.js lowlight
```

```tsx
import { createLowlight } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { RichTextBubbleCodeBlock } from 'reactjs-tiptap-editor/bubble';

const lowlight = createLowlight();
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

const extensions = [...baseExtensions, CodeBlock.configure({ lowlight })];
```

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
import { en, localeActions, useLocale } from 'reactjs-tiptap-editor/locale-bundle';

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

Supported language keys from docs: `en`, `vi`, `zh_CN`, `pt_BR`, `hu_HU`, `fi`, `ja`.

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

Pass `dark={theme === 'dark'}` to `RichTextProvider` when the app tracks dark mode.
