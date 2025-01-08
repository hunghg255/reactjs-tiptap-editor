---
description: How to install reactjs-tiptap-editor

next:
  text: Toolbar
  link: /guide/toolbar.md
---

# Installation

::: code-group

```sh [npm]
npm install reactjs-tiptap-editor
```

```sh [pnpm]
pnpm install reactjs-tiptap-editor
```

```sh [yarn]
yarn add reactjs-tiptap-editor
```

:::

## Usage

```tsx
import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor';

// Import CSS
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  BaseKit.configure({
    // Show placeholder
    placeholder: {  // [!code highlight]
      showOnlyCurrent: true, // [!code highlight]
    },  // [!code highlight]

    // Character count
    characterCount: {  // [!code highlight]
      limit: 50_000,  // [!code highlight]
    },  // [!code highlight]
  }),
  ...
  // Import Extensions Here
];

const DEFAULT = '';

const App = () => {
  const [content, setContent] = useState(DEFAULT);

  const onChangeContent = (value: any) => {
    setContent(value);
  };

  return (
    <RichTextEditor
      output='html'
      content={content}
      onChangeContent={onChangeContent}
      extensions={extensions}
    />
  );
};
```

## Import full bundle

- There are error when install by yarn, you can import full bundle by using `bundle/full` path

```tsx
import RichTextEditor from 'reactjs-tiptap-editor/bundle/full'
```

## Props

```ts
/**
 * Interface for RichTextEditor component props
 */
export interface RichTextEditorProps {
  /** Content of the editor */
  content: string
  /** Extensions for the editor */
  extensions: AnyExtension[]

  /** Output format */
  output: 'html' | 'json' | 'text'
  /** Model value */
  modelValue?: string | object
  /** Dark mode flag */
  dark?: boolean
  /** Dense mode flag */
  dense?: boolean
  /** Disabled flag */
  disabled?: boolean
  /** Label for the editor */
  label?: string
  /** Hide toolbar flag */
  hideToolbar?: boolean
  /** Disable bubble menu flag */
  disableBubble?: boolean
  /** Hide bubble menu flag */
  hideBubble?: boolean
  /** Remove default wrapper flag */
  removeDefaultWrapper?: boolean
  /** Maximum width */
  maxWidth?: string | number
  /** Minimum height */
  minHeight?: string | number
  /** Maximum height */
  maxHeight?: string | number
  /** Content class */
  contentClass?: string | string[] | Record<string, any>
  /** Content change callback */
  onChangeContent?: (val: any) => void
  /** Bubble menu props */
  bubbleMenu?: BubbleMenuProps

  /** Use editor options */
  useEditorOptions?: UseEditorOptions
}
```
