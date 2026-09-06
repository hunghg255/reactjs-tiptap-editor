---
description: Mention

next:
  text: Mermaid
  link: /extensions/Mermaid/index.md
---

# Mention

Insert structured mentions using a trigger such as `@`.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Mention } from 'reactjs-tiptap-editor/mention';
import 'reactjs-tiptap-editor/style.css';

const users = [
  { id: '1', label: 'Alex' },
  { id: '2', label: 'Sam' },
];

const extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure({
    suggestion: {
      char: '@',
      items: ({ query }) =>
        users.filter((user) => user.label.toLowerCase().startsWith(query.toLowerCase())),
    },
  }),
];

export default function MentionExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Type `@` followed by a name to filter suggestions. Return objects with stable `id` and display `label` fields from `items`; an `avatar` is optional. The library supplies a suggestion renderer when you configure `suggestion` or `suggestions`. There is no separate mention toolbar button. For remote search, replace the filter with an async request returning the same shape.

## Multiple triggers

Use `suggestions` to provide separate sources for people and tags. Replace the single `suggestion` configuration with this setup:

```ts
import { Mention } from 'reactjs-tiptap-editor/mention';

const people = [{ id: 'user-1', label: 'Alex' }];
const tags = [{ id: 'tag-1', label: 'Documentation' }];

Mention.configure({
  suggestions: [
    {
      char: '@',
      items: ({ query }) =>
        people.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase())),
    },
    {
      char: '#',
      items: ({ query }) =>
        tags.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase())),
    },
  ],
});
```

Use the arrow keys to move through suggestions and Enter to insert one. The mention stores the selected identifier and label; it does not send a notification or update a user record automatically.
