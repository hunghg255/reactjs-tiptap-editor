---
description: How to customize the Reactjs-Tiptap-Editor.

next:
  text: Customize
  link: /guide/customize.md
---

# Customizing Reactjs-Tiptap-Editor

There are 3 main ways to customize the Reactjs-Tiptap-Editor:

### 1. Extensions

Add extensions to enhance editor functionality:

```tsx
import React from 'react'
import RichTextEditor from 'reactjs-tiptap-editor'
import { BaseKit, Bold, BulletList, Heading, Italic } from 'reactjs-tiptap-editor/extension-bundle'
import 'reactjs-tiptap-editor/style.css'

const extensions = [BaseKit, Heading, Italic, Bold, BulletList]

export default function App() {
  return (
    <RichTextEditor
      content=""
      output="html"
      extensions={extensions}
    />
  )
}
```

### 2. Editor Options

The `useEditorOptions` property provides configuration options for customizing the editor's behavior with the `UseEditorOptions` interface.

### Interface

```tsx
interface UseEditorOptions {
  /** Called when editor content is updated */
  onUpdate?: (props: { editor: Editor, transaction: Transaction }) => void

  /** Called when editor selection changes */
  onSelectionUpdate?: (props: { editor: Editor, transaction: Transaction }) => void

  /** Called when editor gains focus */
  onFocus?: (props: { editor: Editor, event: FocusEvent }) => void

  /** Called when editor loses focus */
  onBlur?: (props: { editor: Editor, event: FocusEvent }) => void

  /** Called when editor transaction is created */
  onTransaction?: (props: { editor: Editor, transaction: Transaction }) => void

  /** Called when editor is created */
  onCreate?: (props: { editor: Editor }) => void

  /** Called before editor is destroyed */
  onDestroy?: () => void

  /** Initial editor state */
  editorState?: string

  /** Enable or disable parsing content */
  enableInputRules?: boolean
  enablePasteRules?: boolean

  /** Enable or disable content editing */
  editable?: boolean

  /** Custom autofocus behavior */
  autofocus?: boolean | 'start' | 'end' | number

  /** Editor view props */
  editorProps?: EditorProps
}
```

Example with editor options:

```tsx
import React from 'react'
import RichTextEditor, { type UseEditorOptions } from 'reactjs-tiptap-editor'
import { BaseKit } from 'reactjs-tiptap-editor/extension-bundle'
import 'reactjs-tiptap-editor/style.css'

const extensions = [BaseKit]

const customOptions: UseEditorOptions = {
  onUpdate: ({ editor }) => console.log('Content updated:', editor.getText()),
  onSelectionUpdate: ({ editor }) => console.log('Selection updated:', editor.getText()),
  onFocus: () => console.log('Editor focused'),
  onBlur: () => console.log('Editor blurred'),
  editable: true,
  autofocus: 'start',
}

export default function App() {
  return (
    <RichTextEditor
      content=""
      output="html"
      useEditorOptions={customOptions}
      extensions={extensions}
    />
  )
}
```

### 3. Accessing the Editor Instance

There are two ways to access the editor instance:
Direct access to the editor instance using `useRef` or `useEditorState`

#### Using useRef:

```tsx
import React, { useRef } from 'react'
import RichTextEditor, { type Editor } from 'reactjs-tiptap-editor'
import { BaseKit } from 'reactjs-tiptap-editor/extension-bundle'
import 'reactjs-tiptap-editor/style.css'

const extensions = [BaseKit]

export default function App() {
  const editorRef = useRef<{ editor: Editor | null }>(null)

  const handleCustomButton = () => {
    if (editorRef.current?.editor) {
      const text = editorRef.current.editor.getText()
      console.log('Current selected text:', text)
    }
  }

  return (
    <div>
      <RichTextEditor
        content=""
        output="html"
        ref={editorRef}
        extensions={extensions}
      />
      <button type="button" onClick={handleCustomButton}>
        Custom Action
      </button>
    </div>
  )
}
```

#### Using useEditorState:

```tsx
import RichTextEditor, { useEditorState } from 'reactjs-tiptap-editor'
import { BaseKit } from 'reactjs-tiptap-editor/extension-bundle'
import 'reactjs-tiptap-editor/style.css'

const extensions = [BaseKit]

export default function App() {
  const { isReady, editor, editorRef } = useEditorState()

  const handleCustomButton = () => {
    if (editor) {
      const text = editor.getText()
      console.log('Current text:', text)
    }
  }

  return (
    <div>
      <RichTextEditor
        content=""
        output="html"
        ref={editorRef}
        extensions={extensions}
      />
      {isReady && (
        <button type="button" onClick={handleCustomButton}>
          Custom Action
        </button>
      )}
    </div>
  )
}
```

### Example: Custom Bubble Menu with Selection Text

```tsx
import RichTextEditor, { BubbleMenu, useEditorState } from 'reactjs-tiptap-editor'
import { BaseKit } from 'reactjs-tiptap-editor/extension-bundle'
import type { Editor } from 'reactjs-tiptap-editor'
import 'reactjs-tiptap-editor/style.css'

interface CustomBubbleMenuProps {
  editor: Editor
}

function CustomBubbleMenu({ editor }: CustomBubbleMenuProps) {
  if (!editor)
    return null

  const handlePrintSelection = () => {
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to)
    console.log('Selected text:', text)
  }

  return (
    <BubbleMenu
      editor={editor}
    >
      <button
        type="button"
        onClick={handlePrintSelection}
      >
        Print Selection
      </button>
    </BubbleMenu>
  )
}

const extensions = [BaseKit]

export default function App() {
  const { isReady, editor, editorRef } = useEditorState()

  return (
    <div>
      <RichTextEditor
        ref={editorRef}
        content=""
        output="html"
        extensions={extensions}
        hideBubble
      />
      {isReady && editor && <CustomBubbleMenu editor={editor} />}
    </div>
  )
}
```
