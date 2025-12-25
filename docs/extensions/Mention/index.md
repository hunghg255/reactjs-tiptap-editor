---
description: Mention

next:
  text: Mermaid
  link: /extensions/Mermaid/index.md
---

# Mention

Mention is a node extension that allows you to add a Mention to your editor.

- Based on TipTap's Link extension. [@tiptap/extension-mention](https://tiptap.dev/docs/editor/extensions/nodes/mention)

## Usage


```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor'

// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Extension
import { Mention } from 'reactjs-tiptap-editor/mention'; // [!code ++]
// ... other extensions


// Import CSS
import 'reactjs-tiptap-editor/style.css';

const MOCK_USERS = [{
    id: '0',
    label: 'hunghg255',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/42096908?v=4'
    }
  },
  {
  id: '1',
    label: 'benjamincanac',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  },
  {
    id: '2',
    label: 'atinux',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/904724?v=4'
    }
  },
  {
    id: '3',
    label: 'danielroe',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/28706372?v=4'
    }
  },
  {
    id: '4',
    label: 'pi0',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/5158436?v=4'
    }
  }
];

const extensions = [
  // Base Extensions
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  })

  ...
  // Import Extensions Here
  Mention.configure({
    // suggestion: {
    //   char: '@',
    //   items: async ({ query }: any) => {
    //     return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
    //   },
    // }
    suggestions: [
      {
        char: '@',
        items: async ({ query }: any) => {
          return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
        },
      },
      {
        char: '#',
        items: async ({ query }: any) => {
          return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
        },
      }
    ]
  }),
];


const App = () => {
   const editor = useEditor({
    textDirection: 'auto', // global text direction
    extensions,
  });

  return (
    <RichTextProvider
      editor={editor}
    >
      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```
