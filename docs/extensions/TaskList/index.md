---
description: TaskList

next:
  text: TextAlign
  link: /extensions/TextAlign/index.md
---

# Task List

 The Task List extension allows you to add task lists to your editor.

- Based on TipTap's task list extension. [@tiptap/extension-task-list](https://tiptap.dev/docs/editor/extensions/nodes/task-list)

## Usage

```tsx
import { TaskList } from 'reactjs-tiptap-editor/tasklist'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TaskList // [!code ++]
];
```
