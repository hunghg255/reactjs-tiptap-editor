---
description: Mermaid

next:
  text: Twitter
  link: /extensions/Twitter/index.md
---

# Mermaid

Mermaid is a node extension that allows you to add an Mermaid to your editor.

- [Mermaid](https://mermaid.js.org/)

## Usage

```tsx
import { Mermaid } from 'reactjs-tiptap-editor/mermaid'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Mermaid.configure({// [!code ++]
    upload: (file: any) => {// [!code ++]
      // upload file to server return url
    },// [!code ++]
  }),// [!code ++]
];
```

## Configuration bubble menu

```tsx
import { BubbleMenuMermaid } from 'reactjs-tiptap-editor/bubble-extra'; // [!code ++]

const App = () => {

  return  <RichTextEditor
    bubbleMenu={{
      render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
        return <>
          {bubbleDefaultDom}

          {extensionsNames.includes('mermaid')  ? <BubbleMenuMermaid disabled={disabled}
            editor={editor}
            key="mermaid"
          /> : null}
        </>
      },
    }}
  />
}
```
