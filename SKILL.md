---
name: reactjs-tiptap-editor
description: A modern WYSIWYG rich-text editor for React, built on [Tiptap](https://tiptap.dev) and [Shadcn UI](https://ui.shadcn.com/) components.
---

## Overview

`reactjs-tiptap-editor` provides a fully-featured, extensible rich-text editing experience with a modular extension architecture. It wraps the Tiptap editor with a beautiful Shadcn-based UI including toolbar, bubble menus, slash commands, and more.

- **Package**: [`reactjs-tiptap-editor`](https://www.npmjs.com/package/reactjs-tiptap-editor)
- **Documentation**: [https://reactjs-tiptap-editor.vercel.app/](https://reactjs-tiptap-editor.vercel.app/)
- **Demo**: [https://reactjs-tiptap-editor-playground.vercel.app/](https://reactjs-tiptap-editor-playground.vercel.app/)
- **Repository**: [https://github.com/hunghg255/reactjs-tiptap-editor](https://github.com/hunghg255/reactjs-tiptap-editor)
- **License**: MIT

## Tech Stack

| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| Framework     | React 19+                                        |
| Editor Core   | Tiptap 3.x (`@tiptap/core`, `@tiptap/react`)     |
| UI Components | Radix UI primitives, Shadcn UI patterns          |
| Styling       | Tailwind CSS 3, SCSS, `class-variance-authority` |
| Icons         | Lucide React, Radix Icons                        |
| Build Tool    | Vite                                             |
| Package Mgr   | pnpm (workspace monorepo)                        |
| Linting       | oxlint, oxfmt                                    |
| TypeScript    | 5.x                                              |
| Node          | >= 18.0.0                                        |

## Installation

```sh
npm install reactjs-tiptap-editor@latest
# or
pnpm install reactjs-tiptap-editor@latest
# or
yarn add reactjs-tiptap-editor@latest
```

## Quick Start

```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { EditorContent, useEditor } from '@tiptap/react';

// Base Tiptap extensions
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Rich-text extensions (import as needed)
import Bold from 'reactjs-tiptap-editor/bold';
import Italic from 'reactjs-tiptap-editor/italic';
import Image from 'reactjs-tiptap-editor/image';
// ... more extensions

import 'reactjs-tiptap-editor/style.css';

const extensions = [
  Document,
  Text,
  Paragraph,
  Dropcursor,
  Gapcursor,
  HardBreak,
  ListItem,
  TextStyle,
  TrailingNode,
  Placeholder.configure({ placeholder: "Press '/' for commands" }),
  Bold,
  Italic,
  Image,
];

function App() {
  const editor = useEditor({ extensions });

  return (
    <RichTextProvider editor={editor}>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## Core API

### `RichTextProvider`

The main wrapper component that provides editor context, toolbar, and bubble menus.

```ts
interface IProviderRichTextProps {
  editor: Editor | null; // Tiptap Editor instance
  dark?: boolean; // Enable dark mode
  children: React.ReactNode;
}
```

### Exports

| Export Path                           | Description                      |
| ------------------------------------- | -------------------------------- |
| `reactjs-tiptap-editor`               | `RichTextProvider` (main export) |
| `reactjs-tiptap-editor/style.css`     | Required stylesheet              |
| `reactjs-tiptap-editor/bubble`        | Bubble menu components           |
| `reactjs-tiptap-editor/theme`         | Theme utilities and hooks        |
| `reactjs-tiptap-editor/locale-bundle` | Locale/i18n bundle               |

## Extensions

Extensions are imported individually for tree-shaking. Each provides toolbar buttons, keyboard shortcuts, and bubble menu integration.

### Text Formatting

| Extension     | Import Path       | Description                      |
| ------------- | ----------------- | -------------------------------- |
| Bold          | `./bold`          | Bold text formatting             |
| Italic        | `./italic`        | Italic text formatting           |
| TextUnderline | `./textunderline` | Underline text formatting        |
| Strike        | `./strike`        | Strikethrough text               |
| Code          | `./code`          | Inline code formatting           |
| Color         | `./color`         | Text color picker                |
| Highlight     | `./highlight`     | Text highlight/background color  |
| FontFamily    | `./fontfamily`    | Font family selector             |
| FontSize      | `./fontsize`      | Font size control                |
| MoreMark      | `./moremark`      | Superscript, subscript, and more |

### Structure & Layout

| Extension      | Import Path        | Description                        |
| -------------- | ------------------ | ---------------------------------- |
| Heading        | `./heading`        | H1–H6 headings                     |
| Blockquote     | `./blockquote`     | Block quotations                   |
| HorizontalRule | `./horizontalrule` | Horizontal divider line            |
| Column         | `./column`         | Multi-column layout                |
| TextAlign      | `./textalign`      | Text alignment (left/center/right) |
| TextDirection  | `./textdirection`  | RTL/LTR text direction             |
| LineHeight     | `./lineheight`     | Line height control                |
| Indent         | `./indent`         | Text indentation                   |
| Callout        | `./callout`        | Callout/admonition blocks          |

### Lists

| Extension   | Import Path     | Description            |
| ----------- | --------------- | ---------------------- |
| BulletList  | `./bulletlist`  | Unordered bullet lists |
| OrderedList | `./orderedlist` | Numbered ordered lists |
| TaskList    | `./tasklist`    | Checkbox task lists    |

### Rich Content

| Extension  | Import Path    | Description                |
| ---------- | -------------- | -------------------------- |
| Image      | `./image`      | Image upload and embedding |
| ImageGif   | `./imagegif`   | GIF image support          |
| Video      | `./video`      | Video embedding            |
| Link       | `./link`       | Hyperlink insertion        |
| Table      | `./table`      | Table with cell controls   |
| Attachment | `./attachment` | File attachment support    |
| Iframe     | `./iframe`     | Embedded iframe content    |
| Emoji      | `./emoji`      | Emoji picker               |
| Mention    | `./mention`    | @mention functionality     |
| Twitter    | `./twitter`    | Embedded tweets            |

### Code & Technical

| Extension  | Import Path    | Description                    |
| ---------- | -------------- | ------------------------------ |
| CodeBlock  | `./codeblock`  | Syntax-highlighted code blocks |
| CodeView   | `./codeview`   | Source HTML code view          |
| Katex      | `./katex`      | LaTeX math equations (KaTeX)   |
| Mermaid    | `./mermaid`    | Mermaid diagrams               |
| Excalidraw | `./excalidraw` | Excalidraw whiteboard drawings |
| Drawer     | `./drawer`     | Freehand drawing canvas        |

### Tools & Utilities

| Extension        | Import Path          | Description                |
| ---------------- | -------------------- | -------------------------- |
| SearchAndReplace | `./searchandreplace` | Find and replace in editor |
| SlashCommand     | `./slashcommand`     | Slash `/` command menu     |
| History          | `./history`          | Undo/redo support          |
| Clear            | `./clear`            | Clear formatting           |
| ImportWord       | `./importword`       | Import from Word (.docx)   |
| ExportWord       | `./exportword`       | Export to Word (.docx)     |
| ExportPdf        | `./exportpdf`        | Export to PDF              |

## Bubble Menus

Context-aware floating menus that appear on content selection or focus:

```tsx
import {
  RichTextBubbleText,
  RichTextBubbleLink,
  RichTextBubbleMedia,
  RichTextBubbleTable,
  RichTextBubbleKatex,
  RichTextBubbleMermaid,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleTwitter,
  RichTextBubbleCallout,
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleMenuDragHandle,
} from 'reactjs-tiptap-editor/bubble';
```

## Theming

Built-in light/dark mode with customizable color palettes and border radius:

```tsx
import { useTheme, themeActions } from 'reactjs-tiptap-editor/theme';

// Available themes: 'light' | 'dark'
themeActions.setTheme('dark');

// Available colors: 'default' | 'red' | 'blue' | 'green' | 'orange' | 'rose' | 'violet' | 'yellow'
themeActions.setColor('blue');

// Customize border radius
themeActions.setBorderRadius(8);
```

## Internationalization (i18n)

Supports multiple languages out of the box:

| Language             | Code    |
| -------------------- | ------- |
| English              | `en`    |
| Vietnamese           | `vi`    |
| Finnish              | `fi`    |
| Hungarian            | `hu`    |
| Portuguese (Brazil)  | `pt-br` |
| Chinese (Simplified) | `zh-cn` |

```tsx
import { useLocale, localeActions } from 'reactjs-tiptap-editor/locale-bundle';

// Set language
localeActions.setLang('zh-cn');

// Add custom translations
localeActions.setMessage({
  /* custom messages */
});
```

## Project Structure

```
src/
├── components/        # UI components (toolbar, buttons, bubbles, dialogs)
├── constants/         # Configuration constants
├── extensions/        # 40+ editor extensions (each self-contained)
├── hooks/             # Custom React hooks (useActive, useAttributes, etc.)
├── locales/           # Translation files (en, vi, fi, hu, pt-br, zh-cn)
├── plugins/           # Editor plugins
├── store/             # Signal-based state management
├── styles/            # Global SCSS styles
├── theme/             # Theme system (light/dark, colors, radius)
├── types.ts           # TypeScript type definitions
├── utils/             # Helper utilities
├── index.ts           # Main entry: exports RichTextProvider
├── locale-bundle.ts   # i18n bundling
└── bubble.ts          # Bubble menu exports
```

## Development

```sh
# Clone and install
git clone https://github.com/hunghg255/reactjs-tiptap-editor.git
cd reactjs-tiptap-editor
pnpm install

# Build the library (with watch mode)
pnpm build:lib:dev

# Run playground dev server
pnpm playground

# Build library for production
pnpm build:lib

# Lint & format
pnpm lint
pnpm fmt

# Type check
pnpm type-check

# Build documentation site
pnpm docs:dev
```

## Key Design Decisions

- **Modular extensions**: Each extension is independently importable for optimal tree-shaking
- **Tiptap 3.x native**: Uses `@tiptap/react`'s `useEditor` hook directly — no custom wrapper
- **Shadcn UI patterns**: UI components follow Shadcn conventions with Radix primitives
- **Signal-based state**: Uses `reactjs-signal` for theme and locale state management
- **Dual format**: Ships both ESM (`*.js`) and CJS (`*.cjs`) with full TypeScript declarations
