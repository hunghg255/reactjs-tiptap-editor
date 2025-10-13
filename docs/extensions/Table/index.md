---
description: Table

next:
  text: TaskList
  link: /extensions/TaskList/index.md
---

# Table

 The Table extension allows you to add tables to your editor.

- Based on TipTap's table extension. [@tiptap/extension-table](https://tiptap.dev/docs/editor/extensions/nodes/table)

## Usage

```tsx
import { Table } from 'reactjs-tiptap-editor/table'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Table // [!code ++]
];
```

## Hiding default items from the bubble menu

By default, a bubble menu is used to provide controls for table editing (such as adding rows, cols, ...).
Items from this menu can be hidden with "hiddenActions" option in the tableConfig.

```jsx
<RichTextEditor
  {...otherProps}
  bubbleMenu={{
    tableConfig: {
      hiddenActions: ['setCellBackground'],
    }
  }}
/>
```
                                         
For supported action keys, please see [TableBubbleMenu.tsx](https://github.com/hunghg255/reactjs-tiptap-editor/blob/main/src/components/menus/components/TableBubbleMenu.tsx) 

