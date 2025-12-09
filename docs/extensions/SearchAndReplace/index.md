---
description: Search And Replace

next:
  text: SlashCommand
  link: /extensions/SlashCommand/index.md
---

# Search And Replace

- Search and Replace Extension for Tiptap Editor.

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
import { SearchAndReplace, RichTextSearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace'; // [!code ++]
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
  SearchAndReplace// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextSearchAndReplace /> {/* [!code ++] */}
    </div>
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

| Prop | Type | Description | Default |
| --- | --- | --- | --- |
| `searchTerm` | `string` | Search Term | `''` |
| `replaceTerm` | `string` | Replace Term | `''` |
| `searchResultClass` | `string` | Search Result Class | `'search-result'` |
| `searchResultCurrentClass` | `string` | Search Result Current Class | `'search-result-current'` |
| `caseSensitive` | `boolean` | Case Sensitive | `false` |
| `disableRegex` | `boolean` | Disable Regex | `false` |
| `onChange` | `() => void` | On Change | `undefined` |
