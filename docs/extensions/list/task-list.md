---
description: Task List

next:
  text: Image
  link: /extensions/media/image.md
---

## Usage

```tsx
import BaseKit, { TaskList } from 'reactjs-tiptap-editor'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TaskList.configure({ // [!code ++]
    taskItem: { // [!code ++]
      nested: true, // [!code ++]
    }, // [!code ++]
  }),, // [!code ++]
];

```
