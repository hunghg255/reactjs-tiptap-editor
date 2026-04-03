# Common Patterns

## Full-Featured Editor

```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor'
import { EditorContent, useEditor } from "@tiptap/react"
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style'
import { ListItem } from '@tiptap/extension-list'

import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold'
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic'
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading'
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist'
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist'
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link'
import { Image } from 'reactjs-tiptap-editor/image'
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table'
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock'
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history'
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand'
import { RichTextBubbleText, RichTextBubbleTable, RichTextBubbleLink, RichTextBubbleImage } from 'reactjs-tiptap-editor/bubble'

import 'reactjs-tiptap-editor/style.css'

const extensions = [
  Document, Text, Dropcursor, Gapcursor, HardBreak,
  Paragraph, TrailingNode, ListItem, TextStyle,
  Placeholder.configure({ placeholder: "Press '/' for commands" }),
  Bold, Italic, Heading, BulletList, OrderedList, Link,
  Image.configure({ upload: async (file) => uploadToServer(file) }),
  Table, CodeBlock, History, SlashCommand,
]

const Toolbar = () => (
  <div className="flex gap-2 border-b p-2">
    <RichTextUndo /> <RichTextRedo />
    <RichTextBold /> <RichTextItalic />
    <RichTextHeading />
    <RichTextBulletList /> <RichTextOrderedList />
    <RichTextLink /> <RichTextTable />
    <RichTextCodeBlock />
  </div>
)

const BubbleMenus = () => (
  <div>
    <RichTextBubbleText />
    <RichTextBubbleLink />
    <RichTextBubbleImage />
    <RichTextBubbleTable />
    <SlashCommandList />
  </div>
)

export default function App() {
  const editor = useEditor({ textDirection: 'auto', extensions })
  return (
    <RichTextProvider editor={editor}>
      <Toolbar />
      <BubbleMenus />
      <EditorContent editor={editor} />
    </RichTextProvider>
  )
}
```

## Minimal Blog Editor (Bold, Italic, Heading, Link only)

```tsx
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold'
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic'
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading'
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link'
// + base kit imports + 'reactjs-tiptap-editor/style.css'

const extensions = [
  ...baseKit,
  Bold, Italic, Heading, Link,
]
```

## Controlled Value (Get/Set HTML)

```tsx
const editor = useEditor({
  extensions,
  content: '<p>Initial content</p>',  // set initial HTML
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()      // get HTML on every change
    setValue(html)
  },
})
```

## RTL / i18n Support

```tsx
const editor = useEditor({
  textDirection: 'auto',  // auto-detects RTL/LTR per paragraph
  extensions,
})
```

## Custom Theme

Override CSS variables in your global stylesheet:
```css
:root {
  --rte-primary: #your-color;
}
```
