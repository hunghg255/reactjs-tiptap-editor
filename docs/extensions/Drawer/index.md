---
description: Drawer
---

# Drawer

Drawer is a node extension that allows you to add an Drawer to your editor.

- [Drawer](https://easydrawer.vercel.app/)

## Usage

```tsx
import { Drawer } from 'reactjs-tiptap-editor/drawer'; // [!code ++]
import 'easydrawer/styles.css'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Drawer.configure({// [!code ++]
    upload: (file: any) => {// [!code ++]
      // upload file to server return url
    },// [!code ++]
  }),// [!code ++]
];
```

## Configuration bubble menu

```tsx
import { BubbleMenuDrawer } from 'reactjs-tiptap-editor/bubble-extra'; // [!code ++]

const App = () => {

  return  <RichTextEditor
    bubbleMenu={{
      render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
        return <>
          {bubbleDefaultDom}

          {extensionsNames.includes('drawer')  ? <BubbleMenuDrawer disabled={disabled}
            editor={editor}
            key="drawer"
          /> : null}
        </>
      },
    }}
  />
}
```
