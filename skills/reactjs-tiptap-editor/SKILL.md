---
name: reactjs-tiptap-editor
description: Guide for using reactjs-tiptap-editor — a modern WYSIWYG rich text editor built on Tiptap and shadcn/ui for React. Use when user asks to integrate a rich text editor, WYSIWYG editor, or tiptap editor into a React project, asks about extensions like Bold, Image, Table, CodeBlock, Mention, SlashCommand, or asks how to configure toolbar, bubble menu, themes, or upload handlers with reactjs-tiptap-editor.
license: MIT
metadata:
  author: hunghg255
  version: 1.0.19
  source: https://github.com/hunghg255/reactjs-tiptap-editor
---

# reactjs-tiptap-editor

A modern WYSIWYG rich text editor based on **Tiptap** and **shadcn/ui** for React. Supports 40+ extensions, theming, bubble menu, slash commands, and file uploads.

## Installation

```bash
npm install reactjs-tiptap-editor@latest
# or
pnpm install reactjs-tiptap-editor@latest
```

For CodeBlock syntax highlighting, also install:

```bash
npm install lowlight
```

## Basic Setup

```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { EditorContent, useEditor } from '@tiptap/react';

// Base Kit (always required)
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Always import CSS
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({ placeholder: "Press '/' for commands" }),
  // add more extensions here
];

const App = () => {
  const editor = useEditor({
    textDirection: 'auto',
    extensions,
  });

  return (
    <RichTextProvider editor={editor}>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
};
```

## Architecture Pattern

Every extension follows the same pattern:

1. Import `ExtensionName` → add to `extensions[]`
2. Import `RichTextExtensionName` → add to toolbar JSX
3. Import bubble menu components from `reactjs-tiptap-editor/bubble` if needed

```tsx
// Pattern example for Bold:
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';

// In extensions array:
extensions = [...baseKit, Bold];

// In toolbar:
const Toolbar = () => <RichTextBold />;
```

See `references/extensions.md` for the full list of all 40+ extensions.
See `references/bubble-menu.md` for bubble menu setup.
See `references/patterns.md` for common use-case patterns.

## Toolbar Setup

```tsx
const RichTextToolbar = () => (
  <div className='flex items-center gap-2 flex-wrap border-b border-solid'>
    <RichTextUndo />
    <RichTextRedo />
    <RichTextBold />
    <RichTextItalic />
    <RichTextHeading />
    {/* Add more toolbar items */}
  </div>
);
```

## Dark Mode

```tsx
<RichTextProvider editor={editor} dark={isDark}>
  ...
</RichTextProvider>
```

## Gotchas

- **Always import** `reactjs-tiptap-editor/style.css` — editor will appear unstyled without it.
- **Base Kit extensions are required**: `Document`, `Text`, `Paragraph`, `Dropcursor`, `Gapcursor`, `HardBreak`, `TrailingNode`, `ListItem`, `TextStyle`, `Placeholder` must always be in the extensions array regardless of which other extensions you use.
- **Each extension has its own sub-path import** (e.g. `reactjs-tiptap-editor/bold`, NOT `reactjs-tiptap-editor`). Importing from the root may not tree-shake correctly.
- **`Attachment` and `Image` need an upload handler** — they won't work without a `upload: (file) => Promise<string>` config.
- **`CodeBlock` needs extra CSS imports** from `lowlight` — forgetting these causes the code block to render without styles.
- **Bubble menu components must be placed inside `RichTextProvider`** — they use editor context. Placing them outside will throw errors.
- **`SlashCommandList` can be placed inside bubble menu** if you want slash commands to appear in the bubble context. It's optional.
- **Folder/file name is case-sensitive**: `SKILL.md`, not `skill.md`.
