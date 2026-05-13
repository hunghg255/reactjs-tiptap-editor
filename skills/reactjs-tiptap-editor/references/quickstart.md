# Quickstart

Use this when creating or explaining a basic `reactjs-tiptap-editor` integration.

## Install

```bash
npm install reactjs-tiptap-editor@latest
pnpm install reactjs-tiptap-editor@latest
bun add reactjs-tiptap-editor@latest
yarn add reactjs-tiptap-editor@latest
```

Use the package manager already present in the user's repo.

## Required Base Shape

```tsx
import { EditorContent, useEditor } from '@tiptap/react';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import 'reactjs-tiptap-editor/style.css';

import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { ListItem } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextStyle } from '@tiptap/extension-text-style';
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';

const baseExtensions = [
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
    placeholder: "Press '/' for commands",
  }),
];
```

## Minimal Component Pattern

```tsx
export function RichTextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (html: string) => void;
}) {
  const editor = useEditor({
    textDirection: 'auto',
    content: value,
    extensions: baseExtensions,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <RichTextProvider editor={editor}>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## Provider Props

`RichTextProvider` accepts:

```ts
interface IProviderRichTextProps {
  editor: Editor | null;
  dark: boolean;
}
```

Some examples omit `dark`; current source defines it as required in type docs, so pass `dark={false}` or the app's theme state when TypeScript complains.

## Server Rendering Notes

- Tiptap editor UI should render in a browser/client component.
- In Next.js App Router, put `'use client'` at the top of the editor component file.
- Do not access `window`, `document`, `FileReader`, or object URLs during server render.

## Common Save Patterns

- HTML: `editor.getHTML()`
- JSON: `editor.getJSON()`
- Plain text: `editor.getText()`

Prefer the output format the host app already uses.
