---
description: Search And Replace

next:
  text: Emoji
  link: /extensions/Emoji/index.md
---

# Search And Replace

- Search and Replace Extension for Tiptap Editor.

## Usage

```tsx
import { SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
   SearchAndReplace, // [!code ++]
];
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
