---
description: Migration Guide

next:
  text: Attachment
  link: /extensions/Attachment.md
---

# Migration Guide

This guide helps you migrate from the old `RichTextEditor` component to the new composable architecture.

## Overview

The new version introduces a more flexible, composable approach that gives you full control over the editor's UI and behavior. Instead of a single monolithic component, you now have:

- **`RichTextProvider`** - Context provider for the editor
- **Individual toolbar components** - `RichTextBold`, `RichTextItalic`, etc.
- **Bubble menu components** - `RichTextBubbleText`, `RichTextBubbleImage`, etc.
- **Direct access to TipTap's `useEditor`** - Full control over the editor instance

## Breaking Changes

### 1. Component Architecture

**Before (Old):**

```tsx
import RichTextEditor from 'reactjs-tiptap-editor'
import { BaseKit } from 'reactjs-tiptap-editor/base-kit'

const extensions = [
  BaseKit.configure({ ... }),
  Bold,
  Italic,
  // ...
]

function App() {
  return (
    <RichTextEditor
      output="html"
      content={content}
      onChangeContent={onValueChange}
      extensions={extensions}
      dark={theme === 'dark'}
      disabled={disable}
    />
  )
}
```

**After (New):**

```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { EditorContent, useEditor } from '@tiptap/react';

// Base Kit - now using individual TipTap extensions
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Extensions now export both the extension and toolbar component
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';

const BaseKit = [
  Document,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
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

const extensions = [
  ...BaseKit,
  Bold,
  Italic,
  // ...
];

function App() {
  const editor = useEditor({
    content,
    extensions,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onValueChange(html);
    },
  });

  return (
    <RichTextProvider editor={editor} dark={theme === 'dark'}>
      <div className='editor-container'>
        {/* Toolbar */}
        <div className='toolbar'>
          <RichTextBold />
          <RichTextItalic />
          {/* Add more toolbar buttons */}
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />

        {/* Bubble Menus */}
        <RichTextBubbleText />
      </div>
    </RichTextProvider>
  );
}
```

### 2. BaseKit Replacement

The `BaseKit` from `reactjs-tiptap-editor/base-kit` is no longer available. You now need to configure the base extensions manually using TipTap's official extensions.

**Before:**

```tsx
import { BaseKit } from 'reactjs-tiptap-editor/base-kit';

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
];
```

**After:**

```tsx
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

const BaseKit = [
  Document,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
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

> **Note:** If you need column support, use the extended Document:
>
> ```tsx
> import { Document } from '@tiptap/extension-document';
> const DocumentColumn = Document.extend({
>   content: '(block|columns)+',
> });
> ```

### 3. Locale Management

**Before:**

```tsx
import { locale } from 'reactjs-tiptap-editor/locale-bundle';

// Change language
locale.setLang('vi');
```

**After:**

```tsx
import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale-bundle';

// In component
const currentLocale = useLocale();
console.log(currentLocale.lang);

// Change language
localeActions.setLang('vi');
```

### 4. Theme Management

**Before:**

```tsx
<RichTextEditor
  dark={theme === 'dark'}
  // ...
/>
```

**After:**

```tsx
import { themeActions, useTheme } from 'reactjs-tiptap-editor/theme'

// Get current theme
const currentTheme = useTheme()

// Change theme
themeActions.setTheme('dark')  // or 'light'

// Change color scheme
themeActions.setColor('red')   // 'default', 'red', 'blue', 'green', 'orange', 'rose', 'violet', 'yellow'

// Change border radius
themeActions.setBorderRadius('0.5rem')

// Provider still accepts dark prop for initial state
<RichTextProvider editor={editor} dark={theme === 'dark'}>
```

### 5. Bubble Menus

**Before:**

```tsx
import {
  BubbleMenuTwitter,
  BubbleMenuKatex,
  BubbleMenuExcalidraw,
  BubbleMenuMermaid,
  BubbleMenuDrawer,
} from 'reactjs-tiptap-editor/bubble-extra';
<RichTextEditor
  bubbleMenu={{
    render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
      return (
        <>
          {bubbleDefaultDom}
          {extensionsNames.includes('twitter') ? <BubbleMenuTwitter editor={editor} /> : null}
          {extensionsNames.includes('katex') ? <BubbleMenuKatex editor={editor} /> : null}
        </>
      );
    },
  }}
/>;
```

**After:**

```tsx
import {
  RichTextBubbleCallout,
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleImage,
  RichTextBubbleVideo,
  RichTextBubbleImageGif,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleMenuDragHandle,
} from 'reactjs-tiptap-editor/bubble';
<RichTextProvider editor={editor}>
  <EditorContent editor={editor} />

  {/* Add bubble menus as siblings */}
  <RichTextBubbleText />
  <RichTextBubbleLink />
  <RichTextBubbleImage />
  <RichTextBubbleVideo />
  <RichTextBubbleTable />
  <RichTextBubbleKatex />
  <RichTextBubbleTwitter />
  <RichTextBubbleExcalidraw />
  <RichTextBubbleMermaid />
  <RichTextBubbleDrawer />
  <RichTextBubbleColumns />
  <RichTextBubbleCallout />
  <RichTextBubbleIframe />
  <RichTextBubbleImageGif />
  <RichTextBubbleMenuDragHandle />
</RichTextProvider>;
```

### 6. Slash Command

**Before:**

```tsx
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand';

const extensions = [
  SlashCommand,
  // ...
];
```

**After:**

```tsx
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand'

const extensions = [
  SlashCommand,
  // ...
]

// Add SlashCommandList component inside the provider
<RichTextProvider editor={editor}>
  <EditorContent editor={editor} />
  <SlashCommandList />
</RichTextProvider>
```

### 7. Column Extension

**Before:**

```tsx
import { ColumnActionButton } from 'reactjs-tiptap-editor/multicolumn';

const extensions = [ColumnActionButton];
```

**After:**

```tsx
import { Column, ColumnNode, MultipleColumnNode, RichTextColumn } from 'reactjs-tiptap-editor/column'

const extensions = [
  Column,
  ColumnNode,
  MultipleColumnNode,
]

// Toolbar button
<RichTextColumn />
```

### 8. Disabled/Editable State

**Before:**

```tsx
<RichTextEditor disabled={disable} />
```

**After:**

```tsx
const editor = useEditor({ ... })

// Toggle editable state
editor.setEditable(true)  // or false

// Check editable state
const isEditable = editor.isEditable
```

### 9. Extension Imports

Each extension now exports both the TipTap extension and its toolbar component:

| Old Import                                                | New Import                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `import { Bold } from 'reactjs-tiptap-editor/bold'`       | `import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold'`                     |
| `import { Italic } from 'reactjs-tiptap-editor/italic'`   | `import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic'`               |
| `import { History } from 'reactjs-tiptap-editor/history'` | `import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history'` |

## Complete Extension Import List

```tsx
// History
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';

// Search and Replace
import { SearchAndReplace, RichTextSearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';

// Formatting
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { TextUnderline, RichTextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';

// Emoji
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';

// Color
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';

// Lists
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist';
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { TaskList, RichTextTaskList } from 'reactjs-tiptap-editor/tasklist';

// Alignment & Spacing
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { LineHeight, RichTextLineHeight } from 'reactjs-tiptap-editor/lineheight';

// Links & Media
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import { Video, RichTextVideo } from 'reactjs-tiptap-editor/video';
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';

// Block Elements
import { Blockquote, RichTextBlockquote } from 'reactjs-tiptap-editor/blockquote';
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';

// Layout
import {
  Column,
  ColumnNode,
  MultipleColumnNode,
  RichTextColumn,
} from 'reactjs-tiptap-editor/column';
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table';

// Embeds
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';

// Import/Export
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { ImportWord, RichTextImportWord } from 'reactjs-tiptap-editor/importword';
import { ExportWord, RichTextExportWord } from 'reactjs-tiptap-editor/exportword';

// Misc
import { TextDirection, RichTextTextDirection } from 'reactjs-tiptap-editor/textdirection';
import { Attachment, RichTextAttachment } from 'reactjs-tiptap-editor/attachment';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import { Callout, RichTextCallout } from 'reactjs-tiptap-editor/callout';

// Advanced
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import { Excalidraw, RichTextExcalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { Twitter, RichTextTwitter } from 'reactjs-tiptap-editor/twitter';

// Mention (extension only, no toolbar button)
import { Mention } from 'reactjs-tiptap-editor/mention';

// Slash Command
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';
```

## CSS Imports

CSS imports remain mostly the same:

```tsx
import 'reactjs-tiptap-editor/style.css';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';

// Optional: For specific extensions
import 'katex/dist/katex.min.css';
import 'easydrawer/styles.css';
import '@excalidraw/excalidraw/index.css';
```

## Migration Checklist

- [ ] Replace `RichTextEditor` with `RichTextProvider` + `EditorContent`
- [ ] Replace `BaseKit` with individual TipTap extensions
- [ ] Update `locale` to `localeActions`/`useLocale`
- [ ] Add `themeActions`/`useTheme` for theme control
- [ ] Replace bubble menu render prop with individual `RichTextBubble*` components
- [ ] Add `SlashCommandList` component if using slash commands
- [ ] Update column imports from `multicolumn` to `column`
- [ ] Replace `disabled` prop with `editor.setEditable()`
- [ ] Import toolbar components (`RichText*`) alongside extensions
- [ ] Build your own toolbar using the individual `RichText*` components

## Benefits of the New Architecture

1. **Full Control** - Complete control over the editor UI and layout
2. **Tree Shaking** - Only include the components you use
3. **Flexibility** - Easily customize toolbar, bubble menus, and other UI elements
4. **Direct TipTap Access** - Use `useEditor` hook directly for advanced customizations
5. **Theme System** - Built-in theme and color scheme management
6. **Better Performance** - Optimized re-renders with individual components
