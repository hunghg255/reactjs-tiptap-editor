# Quickstart

Use for setup and content lifecycle changes. Examples target repository version 1.0.46 with Tiptap 3; check the consumer's installed version first.

## Dependencies

Use the existing package manager and preserve compatible installed versions. Declare packages directly imported by app code instead of relying on transitive dependency hoisting. Match Tiptap versions to the editor package's dependencies.

For a new app using this version:

```bash
pnpm add reactjs-tiptap-editor@1.0.46 @tiptap/react@^3.29.2 @tiptap/extension-document@^3.29.2 @tiptap/extension-paragraph@^3.29.2 @tiptap/extension-text@^3.29.2
```

The app also needs compatible `react` and `react-dom` (this version supports 18 or 19). Add other directly imported packages only for selected features.

## Minimal editor with a toolbar

This component receives **initial** HTML and emits edits. It does not promise controlled `value` semantics.

Its caller owns persistence through `onChange`; keep network/storage code outside this component.

```tsx
'use client';

import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import 'reactjs-tiptap-editor/style.css';

const baseExtensions = [Document, Paragraph, Text];
const extensions = [...baseExtensions, Bold];

export function RichTextEditor({
  initialContent = '<p></p>',
  onChange,
}: {
  initialContent?: string;
  onChange?: (html: string) => void;
}) {
  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <div role="toolbar" aria-label="Text formatting">
        <RichTextBold />
      </div>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

Move CSS to the global entry if required by the framework. The client directive is needed for Next.js App Router; it can be omitted in a client-only Vite app. Keep browser APIs out of server render paths.

`RichTextProvider` currently declares `editor: Editor`, `children: React.ReactNode`, and optional `dark?: boolean`. Its implementation does **not** read `dark`; use [theme actions](feature-recipes.md#theme).

## Supporting schema

Document, Paragraph, and Text form the minimal document. Add HardBreak for soft line breaks, ListItem for bullet/ordered lists, and TextStyle for features using the text-style mark. Placeholder, Dropcursor, Gapcursor, and TrailingNode are optional. See [extension-map.md](extension-map.md) before adding supporting nodes.

Advertise slash commands in a placeholder only when SlashCommand and its list UI are configured.

## Persistence and external updates

- Save HTML with `editor.getHTML()`, JSON with `editor.getJSON()`, or plain text with `editor.getText()`, matching the app's contract.
- `content` initializes the document. Loading a different document requires explicit replacement or an identity-based remount, following the host app's lifecycle.
- In Tiptap 3, use `editor.commands.setContent(nextContent, { emitUpdate: false })` for an external replacement without an `onUpdate` feedback loop. Apply only when an external revision needs loading, not on every keystroke or parent rerender; replacement can disrupt selection and editing.
- Keep a compatible schema when saving and reopening JSON. Removing extensions can lose content that depended on them.
- For read-only mode, use `editable` or `editor.setEditable(...)`; hiding buttons alone does not prevent editing.
