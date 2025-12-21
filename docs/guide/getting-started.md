---
description: How to install reactjs-tiptap-editor

next:
  text: Toolbar
  link: /guide/toolbar.md
---

# Installation

::: code-group

```sh [npm]
npm install reactjs-tiptap-editor@latest
```

```sh [pnpm]
pnpm install reactjs-tiptap-editor@latest
```

```sh [yarn]
yarn add reactjs-tiptap-editor@latest
```
:::

## Usage

```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor'
import { EditorContent, useEditor } from "@tiptap/react";

// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';


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
];

const App = () => {
   const editor = useEditor({
    textDirection: 'auto', // global text direction
    extensions,
  });

  return (
    <RichTextProvider
      editor={editor}
    >
      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```

## Props

```ts
/**
 * Interface for RichTextEditor component props
 */
export interface IProviderRichTextProps {
  editor: Editor | null
  dark: boolean
}
```

## Full Source Code Demo

[Full Source Code Demo](https://github.com/hunghg255/reactjs-tiptap-editor-demo)
