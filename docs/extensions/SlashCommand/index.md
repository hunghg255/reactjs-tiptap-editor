---
description: SlashCommand

next:
  text: Strike
  link: /extensions/Strike/index.md
---

# Slash Command

Open an insertion menu by typing `/` in the document.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';
import { Heading } from 'reactjs-tiptap-editor/heading';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, Heading, SlashCommand];

export default function SlashCommandExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <SlashCommandList />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Register `SlashCommand` and mount `SlashCommandList` inside the provider. The component supplies the command list; the extension handles the trigger and popup. Type `/` in an empty paragraph, filter the list, and choose an item. Register the extensions used by the commands you offer.

## Supply your own command list

Use `commandList` on `SlashCommandList` to replace the default groups. Each group has a `name`, `title`, and `commands` array. A command receives the editor and the range containing the slash query.

```tsx
import { SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';

export function CustomSlashCommands() {
  return (
    <SlashCommandList
      commandList={[
        {
          name: 'insert',
          title: 'Insert',
          commands: [
            {
              name: 'greeting',
              label: 'Greeting',
              description: 'Insert a short greeting',
              aliases: ['hello'],
              action: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertContent('<p>Hello!</p>').run();
              },
            },
          ],
        },
      ]}
    />
  );
}
```

Mount `CustomSlashCommands` in place of the default `SlashCommandList`. Removing `range` prevents the typed slash query from remaining in the document. If an action calls a feature-specific command, register that feature too. Use `shouldBeHidden: (editor) => boolean` to omit a command when its prerequisites are unavailable.

An omitted or empty `commandList` uses the default list. The command-list store is currently shared across editor instances, so mounting different lists in multiple editors can overwrite one another.
