---
description: How to install reactjs-tiptap-editor

next:
  text: Toolbar
  link: /guide/toolbar.md
---

# Getting Started

`reactjs-tiptap-editor` combines Tiptap extensions with ready-made React controls. You create the editor instance, choose its features, and compose the interface.

This guide describes the **1.x composable API** used in this repository. If your app uses `RichTextEditor` or `BaseKit`, start with the [migration guide](/guide/how-to-migrate).

## 1. Install the packages

Start with an existing React application. The example below uses Tiptap 3; keep all `@tiptap/*` packages on a compatible version. This repository currently uses `^3.29.2`.

Install the editor and the packages imported by the minimal example:

::: code-group

```sh [npm]
npm install reactjs-tiptap-editor @tiptap/react@^3.29.2 @tiptap/pm@^3.29.2 @tiptap/extension-document@^3.29.2 @tiptap/extension-paragraph@^3.29.2 @tiptap/extension-text@^3.29.2
```

```sh [pnpm]
pnpm add reactjs-tiptap-editor @tiptap/react@^3.29.2 @tiptap/pm@^3.29.2 @tiptap/extension-document@^3.29.2 @tiptap/extension-paragraph@^3.29.2 @tiptap/extension-text@^3.29.2
```

```sh [bun]
bun add reactjs-tiptap-editor @tiptap/react@^3.29.2 @tiptap/pm@^3.29.2 @tiptap/extension-document@^3.29.2 @tiptap/extension-paragraph@^3.29.2 @tiptap/extension-text@^3.29.2
```

```sh [yarn]
yarn add reactjs-tiptap-editor @tiptap/react@^3.29.2 @tiptap/pm@^3.29.2 @tiptap/extension-document@^3.29.2 @tiptap/extension-paragraph@^3.29.2 @tiptap/extension-text@^3.29.2
```

:::

When another example imports an additional `@tiptap/*` package, add that package to your application too. Extension subpaths such as `reactjs-tiptap-editor/bold` are included in the editor package; they are not separate packages to install.

## 2. Render a working editor

Create `TextEditor.tsx` and render `<TextEditor />` in your application:

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Bold, Italic, History];

export default function TextEditor() {
  const editor = useEditor({
    extensions,
    content: '<p>Select some text and try the toolbar.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <div
        role='toolbar'
        aria-label='Text formatting'
        style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}
      >
        <RichTextUndo />
        <RichTextRedo />
        <RichTextBold />
        <RichTextItalic />
      </div>
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

The stylesheet supplies the editor controls and content styles. You can use ordinary CSS for your layout; these examples do not require Tailwind in the consuming app.

## 3. Understand the pieces

| Piece                                 | Responsibility                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `useEditor`                           | Creates the Tiptap instance and configures content, extensions, and callbacks.               |
| `Document`, `Paragraph`, `Text`       | Define the minimal document structure. Register each once.                                   |
| `Bold`, `Image`, etc.                 | Add document nodes, marks, commands, or behavior to `extensions`.                            |
| `RichTextProvider`                    | Makes the editor available to the library's controls. Wrap the controls and content with it. |
| `RichTextBold`, `RichTextImage`, etc. | Render controls for registered extensions. Place them in the toolbar yourself.               |
| `EditorContent`                       | Renders the editable document. It does not add a toolbar.                                    |

For each feature, register the extension **and** render its control if you want a button. Importing a button alone does not enable the feature. An extension can also be used through commands without a toolbar button.

Avoid registering both a library extension and a Tiptap extension with the same name. If you use `StarterKit`, disable overlapping features there before adding the library's versions.

### Provider props

| Prop       | Type                 | Usage                                                                                                  |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| `editor`   | `Editor`             | Required. Wait until `useEditor` returns an instance.                                                  |
| `children` | `React.ReactNode`    | Your toolbar, content, and optional menus.                                                             |
| `dark`     | `boolean` (optional) | Present in the type but not applied by the current provider. Use [theme actions](/guide/custom-theme). |

Editor settings such as `content`, `editable`, and `onUpdate` belong to `useEditor`, not to `RichTextProvider`.

## 4. Read and save content

Read the current value from the editor when your form submits:

```tsx
// Place this inside TextEditor, after the null guard.
// Replace console.log with your application's save handler.
const handleSave = () => {
  const document = editor.getJSON();
  console.log(document);
};

// Render this button inside your JSX.
<button type='button' onClick={handleSave}>
  Save
</button>;
```

| Method             | Result             | Typical use                                              |
| ------------------ | ------------------ | -------------------------------------------------------- |
| `editor.getJSON()` | Tiptap JSON object | Store structured editor content for later editing.       |
| `editor.getHTML()` | HTML string        | Export HTML for a separate display flow.                 |
| `editor.getText()` | Plain text         | Previews or text-only processing; formatting is omitted. |

To notify a parent or form library on edits, add an `onUpdate` callback to the existing `useEditor` options:

```tsx
const editor = useEditor({
  extensions,
  immediatelyRender: false,
  onUpdate: ({ editor }) => {
    const nextDocument = editor.getJSON();
    console.log(nextDocument); // Call your form's onChange here.
  },
});
```

This callback runs on document updates. Debounce network saves rather than making a request on every keystroke. The editor does not save content or upload media automatically.

## 5. Load or replace content

Pass saved HTML or a parsed Tiptap JSON object as `content` when creating the editor. For a document loaded after initialization, call:

```ts
// Run after loading a document, with a non-null editor instance.
editor.commands.setContent('<p>Loaded document</p>', { emitUpdate: false });
```

Use this when opening or resetting a document, not to feed every `onUpdate` value back into the editor. Replacing content repeatedly can disrupt selection and editing. `emitUpdate: false` prevents this replacement from triggering your save callback. See Tiptap's [setContent reference](https://tiptap.dev/docs/editor/api/commands/content/set-content).

Keep the extensions needed by stored content registered when loading it. Unsupported nodes and marks cannot be represented by the editor schema. Test saved documents before removing an extension from an existing application.

## Read-only mode

Set `editable: false` in `useEditor`, or change it later:

```ts
editor.setEditable(false); // Read-only document.
editor.setEditable(true); // Resume editing.
```

For a reader view, render `EditorContent` with the same content extensions and omit editing controls. Custom media and diagram nodes may need their own styles even in read-only mode.

## Next.js and server rendering

Keep the editor in a client component (`'use client'`) and use `immediatelyRender: false`, as shown above. Handle the initial `null` editor before rendering the provider. Put global stylesheet imports in the location allowed by your framework. See the [Tiptap React integration](https://tiptap.dev/docs/editor/getting-started/install/react).

## Troubleshooting

| Symptom                                       | What to check                                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| Toolbar button is missing                     | Register its matching extension and render the button under `RichTextProvider`.   |
| Unknown node or missing command               | Check required companion extensions on the feature's page.                        |
| Duplicate extension warning                   | Remove overlapping registrations, including those inside `StarterKit`.            |
| UI has no styling                             | Import `reactjs-tiptap-editor/style.css` and any feature-specific stylesheet.     |
| Content does not change after fetching        | Use `setContent` after loading; `content` initializes the document.               |
| A slash placeholder appears but no menu opens | Register `SlashCommand` and mount `SlashCommandList`; a placeholder is only text. |
| Upload does not persist                       | Supply an upload callback that resolves to a durable URL.                         |

## Add more features

Continue with [Toolbar](/guide/toolbar), [Bubble Menu](/guide/bubble-menu), [Internationalization](/guide/internationalization), and [Custom Theme](/guide/custom-theme). Each extension page includes its setup and usage notes.
