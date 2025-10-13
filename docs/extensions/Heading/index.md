---
description: Heading

next:
  text: Highlight
  link: /extensions/Highlight/index.md
---

# Heading

The Heading extension allows you to add a heading to your editor.

- Based on TipTap's heading extension. [@tiptap/extension-heading](https://tiptap.dev/docs/editor/extensions/nodes/heading)

## Usage

```tsx
import { Heading } from 'reactjs-tiptap-editor/heading'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Heading // [!code ++]
];
```

## Options

### shortcutKeys

Type: `string[][]`\
Default: `['alt', 'mod', '${level}']`

Keyboard shortcuts for the extension. To override shortcuts for different heading levels:

```tsx
Heading.configure({
  shortcutKeys: [
    ['alt', 'mod', '0'],
    ['alt', 'mod', '1'],
    ['alt', 'mod', '2'],
    ['alt', 'mod', '3'],
    ['alt', 'mod', '4'],
    ['alt', 'mod', '5'],
    ['alt', 'mod', '6'],
    ...      
  ]
});
```
