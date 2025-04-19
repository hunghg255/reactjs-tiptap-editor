---
description: SlashCommand

next:
  text: Strike
  link: /extensions/Strike/index.md
---

# Slash Command

The Slash Command extension allows you to add slash commands to your editor.
- type `/` to trigger the slash command menu.

## Usage

```tsx
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  SlashCommand // [!code ++]
];
```
