---
description: Bubble Menu

next:
  text: Internationalization
  link: /guide/internationalization.md
---

# Bubble Menu

The bubble menu, as its name suggests, is a context menu that appears when you select content for editing. It provides quick access to editing operations, such as `Bold`, `Italic`, and `Code`, among others.

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
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
// ... other extensions

// Bubble Menu
import {
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleImage,
  RichTextBubbleVideo,
  RichTextBubbleImageGif,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,

  // Drag Handle
  RichTextBubbleMenuDragHandle
} from 'reactjs-tiptap-editor/bubble';


// Import CSS
import 'reactjs-tiptap-editor/style.css';

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
  History
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextUndo />
      <RichTextRedo />
    </div>
  )
}

const RichTextBubbleMenu = () => {
  return (
    <div>
      <RichTextBubbleColumns />
      <RichTextBubbleDrawer />
      <RichTextBubbleExcalidraw />
      <RichTextBubbleIframe />
      <RichTextBubbleKatex />
      <RichTextBubbleLink />

      <RichTextBubbleImage />
      <RichTextBubbleVideo />
      <RichTextBubbleImageGif />

      <RichTextBubbleMermaid />
      <RichTextBubbleTable />
      <RichTextBubbleText />
      <RichTextBubbleTwitter />

      <RichTextBubbleMenuDragHandle />
    </div>
  )
}

const App = () => {
   const editor = useEditor({
    textDirection: 'auto', // global text direction
    extensions,
  });

  return (
    <RichTextProvider
      editor={editor}
    >
      <RichTextToolbar />
      <RichTextBubbleMenu />

      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```

## Note

The bubble menu will be automatically enabled when you import the correct plugins.

The system provides the following default bubble menus:

| Component Name  | Functionality                                                                                | Extension |
|:---------------:|----------------------------------------------------------------------------------------------|---------------------|
| RichTextBubbleText  | Provides text-related editing operations like bold, italic, underline, etc.                  | text          |
| RichTextBubbleLink  | Provides link-related operations like add, edit, delete links                                | link          |
| RichTextBubbleImage | Provides image-related operations like resizing, alignment, etc.                             | image         |
| RichTextBubbleVideo | Provides video-related operations like playback control, size adjustment, etc.               | video         |
| RichTextBubbleTable | Provides table-related operations like adding/deleting rows and columns, merging cells, etc. | table         |
| RichTextBubbleIframe     | Provides iframe-related  operations like size, link , etc.  | iframe          |
| RichTextBubbleColumns   | Provides multi-column layout operations like adjusting column numbers, widths, etc.          | column        |
| RichTextBubbleImageGif   | Provides general content-related operations like copy, paste, delete, image gif etc.                   | imageGif  |
| RichTextBubbleDrawer   | Provides drawer-related operations like size, link , etc.  | drawer          |
| RichTextBubbleExcalidraw   | Provides excalidraw-related operations like size, link , etc.  | excalidraw          |
| RichTextBubbleMermaid   | Provides mermaid-related operations like size, link , etc.  | mermaid          |
| RichTextBubbleTwitter   | Provides twitter-related operations like size, link , etc.  | twitter          |
| RichTextBubbleMenuDragHandle  | Provides a drag handle to move the bubble menu around the editor area.                       | N/A           |
