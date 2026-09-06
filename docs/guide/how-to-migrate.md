---
description: Migration Guide

next:
  text: Attachment
  link: /extensions/Attachment/index.md
---

# Migration Guide

Use this guide when moving from the legacy `RichTextEditor` / `BaseKit` API to the **1.x composable API**. For a new project, follow [Getting Started](/guide/getting-started).

Keep a sample of your existing saved content and test it with the new extension configuration before switching users over.

## What changes

| Legacy API                         | Composable API                                                       |
| ---------------------------------- | -------------------------------------------------------------------- |
| Default `RichTextEditor` component | Named `RichTextProvider` with Tiptap's `EditorContent`.              |
| `extensions` on the component      | `extensions` in `useEditor`.                                         |
| `content` and `output` props       | `content` in `useEditor`; read `getHTML()` or `getJSON()`.           |
| `onChangeContent`                  | `onUpdate: ({ editor }) => ...` in `useEditor`.                      |
| `BaseKit.configure(...)`           | Register the individual base extensions and configure them directly. |
| Automatically assembled toolbar    | Render `RichText*` controls explicitly inside the provider.          |
| Bubble menu render configuration   | Mount individual `RichTextBubble*` components.                       |
| `disabled`                         | `editable` in `useEditor` or `editor.setEditable(...)`.              |
| `dark`                             | `themeActions.setTheme('light' or 'dark')`.                          |
| Legacy locale API                  | `localeActions` and `useLocale` from `/locale-bundle`.               |
| `/multicolumn` imports             | `/column` with `Column`, `ColumnNode`, `MultipleColumnNode`.         |

## Replace the editor component

Install the packages listed in Getting Started. This component receives initial HTML and reports edits to your existing save handler:

```tsx
'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Bold, Italic, History];

type MigratedEditorProps = {
  initialContent: string;
  onChangeContent: (html: string) => void;
  disabled?: boolean;
};

export default function MigratedEditor({
  initialContent,
  onChangeContent,
  disabled = false,
}: MigratedEditorProps) {
  const editor = useEditor({
    extensions,
    content: initialContent,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChangeContent(editor.getHTML()),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

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
      <RichTextBubbleText
        buttonBubble={
          <>
            <RichTextBold />
            <RichTextItalic />
          </>
        }
      />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

`initialContent` initializes the document. When opening another document, either remount with a document-specific React `key` or call `setContent` after loading it. Do not reset the document whenever your save handler updates parent state. See [loading content](/guide/getting-started#_5-load-or-replace-content).

For JSON storage, change the callback to `editor.getJSON()` and type your value as Tiptap's `JSONContent`, imported from `@tiptap/core`.

## Replace BaseKit deliberately

The minimal schema needs `Document`, `Paragraph`, and `Text`. Add the rest according to your existing features:

| Requirement                | Extension to add                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Line breaks                | `HardBreak` from `@tiptap/extension-hard-break`.                                   |
| Placeholder                | `Placeholder` from `@tiptap/extensions`.                                           |
| Drag/drop cursor           | `Dropcursor` from `@tiptap/extensions`.                                            |
| Cursor between blocks      | `Gapcursor` from `@tiptap/extensions`.                                             |
| Final trailing paragraph   | `TrailingNode` from `@tiptap/extensions`.                                          |
| Character limit            | `CharacterCount` from `@tiptap/extensions`.                                        |
| Bullet/numbered list items | `ListItem` from `@tiptap/extension-list`, alongside the list extension.            |
| Color, fonts, line height  | `TextStyle` from `@tiptap/extension-text-style`, alongside the feature extensions. |
| Undo/redo                  | Library `History` extension.                                                       |

For example, preserve a placeholder and character limit by adding these configured extensions to your array:

```ts
import { CharacterCount, Placeholder } from '@tiptap/extensions';

const extraExtensions = [
  Placeholder.configure({ placeholder: 'Start writing…', showOnlyCurrent: true }),
  CharacterCount.configure({ limit: 50_000 }),
];
```

Spread `extraExtensions` into your existing `extensions` array. A placeholder mentioning `/` does not enable slash commands; those require their own extension and list component.

If you already use `StarterKit`, disable any overlapping extensions before registering the library versions. Keep Tiptap packages on compatible versions; the current source uses Tiptap 3.

## Restore toolbar and bubble features

For each previously enabled feature:

1. Import its extension from the documented package subpath.
2. Add it and any companion extensions to `useEditor({ extensions })`.
3. Import and mount its `RichText*` toolbar control.
4. Mount a matching bubble component if contextual editing is needed.
5. Restore feature-specific configuration such as upload callbacks and CSS imports.

See [Toolbar](/guide/toolbar) and [Bubble Menu](/guide/bubble-menu) for component mappings and custom controls.

## Restore theme and locale

Use actions during client initialization or in preference-change handlers:

```ts
import { themeActions } from 'reactjs-tiptap-editor/theme';
import { localeActions } from 'reactjs-tiptap-editor/locale-bundle';

themeActions.setTheme('dark');
localeActions.setLang('vi');
```

These settings are shared across editor instances. The provider's current `dark` prop is not applied by its implementation. See [Custom Theme](/guide/custom-theme) and [Internationalization](/guide/internationalization).

## Restore columns and slash commands

Column layouts need all three exports from `/column` and the document setup shown on the [Column page](/extensions/Column/). Do not register the original and extended Document together.

For slash commands, register `SlashCommand` and mount `<SlashCommandList />` under `RichTextProvider`. For a custom menu, use its `commandList` prop; see [Slash Command](/extensions/SlashCommand/).

## Verify the migration

- Load representative saved HTML/JSON and confirm formatting, lists, tables, links, and custom nodes survive a save/reload cycle.
- Test undo/redo, selection controls, keyboard shortcuts, and changes to read-only state.
- Verify upload handlers return persistent URLs and failed uploads are visible to users.
- Check theme, translations, feature stylesheets, and client initialization in your framework.
- Test Word/PDF export with the actual node types your app uses; these formats do not guarantee every editor feature will be preserved.
