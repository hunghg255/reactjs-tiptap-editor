---
description: HorizontalRule

next:
  text: Iframe
  link: /extensions/Iframe/index.md
---

# Horizontal Rule

 Horizontal Rule is a node extension that allows you to add a horizontal rule to your editor.

- Based on TipTap's Horizontal extension. [@tiptap/extension-horizontal-rule](https://tiptap.dev/docs/editor/extensions/nodes/horizontal-rule)

## Usage

```tsx
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  HorizontalRule // [!code ++]
];
```

## Options

### shortcutKeys

Type: `string[]`\
Default: `['mod', 'alt', 'S']`

Keyboard shortcuts for the extension.
