---
description: Excalidraw

next:
  text: TextDirection
  link: /extensions/TextDirection/index.md
---

# Excalidraw

The Excalidraw extension allows you to add an Excalidraw to your editor.

- Based on Excalidraw. [Excalidraw](https://excalidraw.com/)

## Usage

```tsx
import { Excalidraw } from 'reactjs-tiptap-editor/excalidraw'; // [!code ++]
import "@excalidraw/excalidraw/index.css"; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Excalidraw // [!code ++]
];
```

## Configuration bubble menu

```tsx
import { BubbleMenuExcalidraw } from 'reactjs-tiptap-editor/bubble-extra'; // [!code ++]

const App = () => {

  return  <RichTextEditor
    bubbleMenu={{
      render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
        return <>
          {bubbleDefaultDom}

          {extensionsNames.includes('excalidraw')  ? <BubbleMenuExcalidraw disabled={disabled}
            editor={editor}
            key="excalidraw"
          /> : null}
        </>
      },
    }}
  />
}
```
