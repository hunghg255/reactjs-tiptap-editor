---
description: How to install reactjs-tiptap-editor

next:
  text: Toolbar
  link: /guide/toolbar.md
---

# Installation React 19

::: code-group

```sh [npm]
npm install reactjs-tiptap-editor@latest
```

```sh [pnpm]
pnpm install reactjs-tiptap-editor@latest
```

```sh [yarn]
yarn add reactjs-tiptap-editor@latest
```

:::

## Install React version less than 18.0.0

::: code-group

```sh [npm]
npm install reactjs-tiptap-editor@0.1.16
```
```

```sh [pnpm]
pnpm install reactjs-tiptap-editor@0.1.16
```

```sh [yarn]
yarn add reactjs-tiptap-editor@0.1.16
```

:::


## Usage

```tsx
import RichTextEditor from 'reactjs-tiptap-editor';
import { BaseKit } from 'reactjs-tiptap-editor';
// import { BaseKit } from 'reactjs-tiptap-editor/extension-bundle'; // for version 0.1.16 and lower

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
