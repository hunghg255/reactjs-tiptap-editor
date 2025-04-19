---
description: Twitter

next:
  text: Drawer
  link: /extensions/Drawer/index.md
---

# Twitter

Twitter is a node extension that allows you to add an Twitter to your editor.

- [react-tweet](https://www.npmjs.com/package/react-tweet)

## Usage

```tsx
import { Twitter } from 'reactjs-tiptap-editor/twitter'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Twitter
];
```


## Configuration bubble menu

```tsx
import { BubbleMenuTwitter } from 'reactjs-tiptap-editor/bubble-extra'; // [!code ++]

const App = () => {

  return  <RichTextEditor
    bubbleMenu={{
      render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
        return <>
          {bubbleDefaultDom}

          {extensionsNames.includes('twitter')  ? <BubbleMenuTwitter disabled={disabled}
            editor={editor}
            key="twitter"
          /> : null}
        </>
      },
    }}
  />
}
```
