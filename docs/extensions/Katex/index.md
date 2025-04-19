---
description: Katex

next:
  text: ExportPdf
  link: /extensions/ExportPdf/index.md
---

# Katex

- Katex Extension for Tiptap Editor.
- This extension allows you to add Katex math equations to your editor.
- Supports inline and block math equations.
- This extension is based on [katex](https://katex.org/).

## Usage

```tsx

import { Katex } from 'reactjs-tiptap-editor/katex'; // [!code ++]

import 'katex/dist/katex.min.css'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
   Katex, // [!code ++]
];
```

## Configuration bubble menu

```tsx
import { BubbleMenuKatex } from 'reactjs-tiptap-editor/bubble-extra'; // [!code ++]

const App = () => {

  return  <RichTextEditor
    bubbleMenu={{
      render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
        return <>
          {bubbleDefaultDom}

          {extensionsNames.includes('katex')  ? <BubbleMenuKatex disabled={disabled}
            editor={editor}
            key="katex"
          /> : null}
        </>
      },
    }}
  />
}
```
