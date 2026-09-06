---
description: Toolbar

next:
  text: Bubble Menu
  link: /guide/bubble-menu.md
---

# Toolbar

A toolbar is a layout you compose from `RichText*` controls. Its button order follows your JSX. Each control reads the editor from `RichTextProvider`, so you do not pass an `editor` prop to individual buttons.

Start with the working editor in [Getting Started](/guide/getting-started). To add headings and lists, install `@tiptap/extension-list` at the same version as your other Tiptap packages, then add these imports:

```tsx
import { ListItem } from '@tiptap/extension-list';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist';
```

Extend the existing `extensions` array with `Heading.configure({ levels: [1, 2, 3] })`, `ListItem`, and `BulletList`. Register each extension only once. Then replace the toolbar JSX with:

```tsx
<div
  role='toolbar'
  aria-label='Text formatting'
  style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}
>
  <RichTextUndo />
  <RichTextRedo />
  <RichTextHeading />
  <RichTextBold />
  <RichTextItalic />
  <RichTextBulletList />
</div>
```

The other controls in this example come from Getting Started. Select text to apply inline formatting; place the cursor in a paragraph to turn it into a heading or list.

## Extension options and button placement

Configure behavior in the extension array, for example `Heading.configure({ levels: [1, 2, 3] })`. Render its control as `<RichTextHeading />` inside the provider. Removing that control only removes the toolbar entry; the registered extension still parses content and exposes commands.

Some controls need companion extensions:

| Control                                                                         | Register                                                                                                                   |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `RichTextBulletList`, `RichTextOrderedList`                                     | Corresponding list extension plus `ListItem`.                                                                              |
| `RichTextColor`, `RichTextFontFamily`, `RichTextFontSize`, `RichTextLineHeight` | Corresponding extension plus `TextStyle`.                                                                                  |
| `RichTextTaskList`                                                              | `TaskList`; it includes `TaskItem`.                                                                                        |
| `RichTextTable`                                                                 | `Table`; it includes row, cell, and header extensions.                                                                     |
| `RichTextColumn`                                                                | `Column`, `ColumnNode`, `MultipleColumnNode`, and the document schema described on the [Column page](/extensions/Column/). |

## Build a custom control

You can call editor commands from an ordinary React button. This example reads the provider's context and subscribes to the state it displays:

```tsx
import { useCurrentEditor, useEditorState } from '@tiptap/react';

export function CustomBoldButton() {
  const { editor } = useCurrentEditor();
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      active: editor?.isActive('bold') ?? false,
      enabled: Boolean(editor?.isEditable && editor.can().toggleBold()),
    }),
  });

  return (
    <button
      type='button'
      aria-pressed={state?.active ?? false}
      disabled={!state?.enabled}
      onClick={() => editor?.chain().focus().toggleBold().run()}
    >
      Bold
    </button>
  );
}
```

Register `Bold` and render `<CustomBoldButton />` inside `RichTextProvider`. `focus()` returns focus to the document before formatting. `type="button"` prevents accidental form submission.

## Keyboard shortcuts

A documented `shortcutKeys` option supplies shortcut labels to controls. Changing those labels does not generally register a new key binding. To change behavior, extend the extension's `addKeyboardShortcuts` method:

```tsx
import { Bold } from 'reactjs-tiptap-editor/bold';

const CustomBold = Bold.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-Shift-b': () => this.editor.commands.toggleBold(),
    };
  },
}).configure({ shortcutKeys: ['mod', 'shift', 'B'] });
```

Use `CustomBold` in place of `Bold`. This example preserves inherited shortcuts and adds another one. `Mod` represents Command on macOS and Control on Windows/Linux.

For controls that appear only around a selection, see [Bubble Menu](/guide/bubble-menu).
