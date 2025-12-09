---
description: Color

next:
  text: Column
  link: /extensions/Column/index.md
---

# Color

The Color extension allows you to add text color to your editor with support for custom colors, keyboard shortcuts, and synchronized color selection across toolbar and bubble menu.

- Based on TipTap's Color extension. [@tiptap/extension-text-style](https://tiptap.dev/docs/editor/extensions/functionality/color)

## Usage


```tsx
import { RichTextProvider } from 'reactjs-tiptap-editor'

// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Extension
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color'; // [!code ++]
// ... other extensions


// Import CSS
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  // Base Extensions
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  })

  ...
  // Import Extensions Here
  Color// [!code ++]
];

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextColor /> {/* [!code ++] */}
    </div>
  )
}

const App = () => {
   const editor = useEditor({
    textDirection: 'auto', // global text direction
    extensions,
  });

  return (
    <RichTextProvider
      editor={editor}
    >
      <RichTextToolbar />

      <EditorContent
        editor={editor}
      />
    </RichTextProvider>
  );
};
```


## Options

### colors

Type: `string[]`\
Default: `undefined`

An array of color options to display in the color picker. If not provided, a default set of colors will be used.

```js
import { COLORS_LIST } from 'reactjs-tiptap-editor'

Color.configure({
  colors: COLORS_LIST,
  // or custom colors
  colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
})
```

### defaultColor

Type: `string`\
Default: `undefined`

The default color to use when the extension is initialized. This color will be used when applying color via keyboard shortcut for the first time.

```js
import { DEFAULT_COLOR } from 'reactjs-tiptap-editor'

Color.configure({
  defaultColor: DEFAULT_COLOR,
  // or
  defaultColor: '#000000',
})
```

### shortcutKeys

Type: `string[]`\
Default: `['⇧', 'mod', 'C']`

Keyboard shortcuts for applying the color. Default is `Mod-Shift-C` (Ctrl-Shift-C on Windows/Linux, Cmd-Shift-C on Mac).

```js
Color.configure({
  shortcutKeys: ['⇧', 'mod', 'C'],
})
```

## Keyboard Shortcut Behavior

The `Mod-Shift-C` keyboard shortcut has intelligent toggle behavior:

1. **No color applied**: Applies the currently selected color
2. **Same color already applied**: Removes the color (toggle off)
3. **Different color applied**: Replaces with the currently selected color
4. **"No Fill" selected**: Does nothing (prevents applying undefined color)

## Color Selection Synchronization

The extension maintains a shared color state across all instances:

- Selecting a color in the toolbar updates the bubble menu
- Selecting a color in the bubble menu updates the toolbar
- Keyboard shortcut uses the last selected color
- All color pickers show the same selected color

## Examples

### Basic Usage

```tsx
import { Color } from 'reactjs-tiptap-editor/color';

const extensions = [
  Color,
];
```

### With Custom Colors

```tsx
import { Color, COLORS_LIST } from 'reactjs-tiptap-editor';

const extensions = [
  Color.configure({
    colors: [
      ...COLORS_LIST,
      '#FF69B4', // Hot Pink
      '#8A2BE2', // Blue Violet
    ],
    defaultColor: '#000000',
  }),
];
```

### Programmatic Usage

```tsx
// Apply color
editor.chain().focus().setColor('#FF0000').run();

// Remove color
editor.chain().focus().unsetColor().run();

// Check if color is active
const isColorActive = editor.isActive('textStyle', { color: '#FF0000' });

// Get current color
const { color } = editor.getAttributes('textStyle');
```
