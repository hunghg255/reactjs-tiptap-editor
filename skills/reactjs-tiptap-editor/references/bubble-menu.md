# Bubble Menu Reference

Bubble menus appear as floating context toolbars when the user selects content.

## Import

```tsx
import {
  RichTextBubbleText,
  RichTextBubbleLink,
  RichTextBubbleImage,
  RichTextBubbleVideo,
  RichTextBubbleTable,
  RichTextBubbleIframe,
  RichTextBubbleColumns,
  RichTextBubbleImageGif,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleMermaid,
  RichTextBubbleTwitter,
  RichTextBubbleCallout,
  RichTextBubbleKatex,
  RichTextBubbleMenuDragHandle,
} from 'reactjs-tiptap-editor/bubble'

import { SlashCommandList } from 'reactjs-tiptap-editor/slashcommand'
```

## Full Setup

```tsx
const RichTextBubbleMenu = () => (
  <div>
    <RichTextBubbleText />       {/* Bold, italic, underline, etc on selected text */}
    <RichTextBubbleLink />       {/* Add/edit/delete links */}
    <RichTextBubbleImage />      {/* Resize, align images */}
    <RichTextBubbleVideo />      {/* Video controls */}
    <RichTextBubbleTable />      {/* Add/delete rows, cols, merge cells */}
    <RichTextBubbleIframe />     {/* Iframe size/link */}
    <RichTextBubbleColumns />    {/* Column count/widths */}
    <RichTextBubbleImageGif />   {/* GIF operations */}
    <RichTextBubbleDrawer />     {/* Drawer options */}
    <RichTextBubbleExcalidraw /> {/* Excalidraw options */}
    <RichTextBubbleMermaid />    {/* Mermaid options */}
    <RichTextBubbleTwitter />    {/* Twitter embed */}
    <RichTextBubbleCallout />    {/* Callout style/content */}
    <RichTextBubbleKatex />      {/* Math formula */}
    <RichTextBubbleMenuDragHandle /> {/* Drag to reorder blocks */}
    <SlashCommandList />         {/* Optional: slash commands in bubble */}
  </div>
)
```

## Gotcha

- Only add bubble components for extensions you have installed. Having `RichTextBubbleTable` without the `Table` extension causes silent failures.
- All bubble menu components must be rendered inside `<RichTextProvider>`.
