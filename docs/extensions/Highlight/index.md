---
description: Highlight

next:
  text: History
  link: /extensions/History/index.md
---

# Highlight

The Highlight extension allows you to highlight text in your editor with support for multiple colors, keyboard shortcuts, and synchronized color selection across toolbar and bubble menu.

- Based on TipTap's highlight extension. [@tiptap/extension-highlight](https://tiptap.dev/docs/editor/extensions/marks/highlight)

## Usage

```tsx
import { Highlight } from 'reactjs-tiptap-editor/highlight'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Highlight, // [!code ++]
  // or with configuration
  Highlight.configure({ // [!code ++]
    defaultColor: '#ffff00', // [!code ++]
  }), // [!code ++]
];
```

## Features

- 🎨 **Multiple Colors**: Support for multiple highlight colors
- ⌨️ **Keyboard Shortcuts**: Quick highlighting with `Mod-Shift-H`
- 🔄 **Smart Toggle**: Intelligent highlight toggling and replacement
- 🎯 **Synchronized Selection**: Color picker syncs between toolbar and bubble menu
- 🎨 **Custom Colors**: Add custom highlight colors via color picker
- 💾 **Recent Colors**: Automatically tracks recently used colors
- ❌ **No Fill Option**: Option to remove highlight

## Options

### defaultColor

Type: `string`\
Default: `undefined`

The default highlight color to use when the extension is initialized. This color will be used when applying highlight via keyboard shortcut for the first time.

```js
Highlight.configure({
  defaultColor: '#ffff00', // Yellow
  // or
  defaultColor: '#ffc078', // Orange
})
```

### shortcutKeys

Type: `string[]`\
Default: `['⇧', 'mod', 'H']`

Keyboard shortcuts for applying the highlight. Default is `Mod-Shift-H` (Ctrl-Shift-H on Windows/Linux, Cmd-Shift-H on Mac).

```js
Highlight.configure({
  shortcutKeys: ['⇧', 'mod', 'H'],
})
```

## Keyboard Shortcut Behavior

The `Mod-Shift-H` keyboard shortcut has intelligent toggle behavior:

1. **No highlight applied**: Applies the currently selected highlight color
2. **Same color already applied**: Removes the highlight (toggle off)
3. **Different color applied**: Replaces with the currently selected highlight color
4. **"No Fill" selected**: Does nothing (prevents applying undefined highlight)

## Color Selection Synchronization

The extension maintains a shared highlight color state across all instances:

- Selecting a color in the toolbar updates the bubble menu
- Selecting a color in the bubble menu updates the toolbar
- Keyboard shortcut uses the last selected color
- All color pickers show the same selected color
- Selecting "No Fill" clears the stored color

## Examples

### Basic Usage

```tsx
import { Highlight } from 'reactjs-tiptap-editor/highlight';

const extensions = [
  Highlight,
];
```

### With Default Color

```tsx
import { Highlight } from 'reactjs-tiptap-editor/highlight';

const extensions = [
  Highlight.configure({
    defaultColor: '#ffc078', // Orange highlight
  }),
];
```

### Programmatic Usage

```tsx
// Apply highlight with color
editor.chain().focus().setHighlight({ color: '#ffff00' }).run();

// Remove highlight
editor.chain().focus().unsetHighlight().run();

// Toggle highlight (removes if same color, applies if different or none)
editor.chain().focus().toggleHighlight({ color: '#ffff00' }).run();

// Check if highlight is active
const isHighlightActive = editor.isActive('highlight');

// Check if specific color is active
const isYellowActive = editor.isActive('highlight', { color: '#ffff00' });

// Get current highlight color
const { color } = editor.getAttributes('highlight');
```

## Color Picker

The highlight color picker includes:

- **No Fill**: Remove highlight from text
- **Color Palette**: Predefined colors for quick selection
- **Recent Colors**: Last 10 used colors
- **Custom Color**: Pick any color using the color picker

## Differences from Color Extension

| Feature | Highlight | Color |
|---------|-----------|-------|
| Purpose | Background highlighting | Text color |
| Default Shortcut | `Mod-Shift-H` | `Mod-Shift-C` |
| No Fill Behavior | Removes highlight | Removes text color |
| Visual Style | Background color | Foreground color |
