---
description: How to install reactjs-tiptap-editor

next:
  text: Bubble Menu
  link: /guide/bubble-menu.md
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
import BaseKit from 'reactjs-tiptap-editor';

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
interface IPropsRichTextEditor {
  content: string;
  extensions: AnyExtension[];
  output: 'html' | 'json' | 'text';
  modelValue?: string | object;
  dark?: boolean;
  dense?: boolean;
  disabled?: boolean;
  label?: string;
  hideToolbar?: boolean;
  disableBubble?: boolean;
  hideBubble?: boolean;
  removeDefaultWrapper?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  editorClass?: string | string[] | Record<string, any>;
  contentClass?: string | string[] | Record<string, any>;
  onChangeContent?: (val: any) => void;
  useEditorOptions?: UseEditorOptions;
}
```
