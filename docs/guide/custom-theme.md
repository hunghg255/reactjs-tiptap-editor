---
description: Custom Theme

next:
  text: Attachment
  link: /extensions/Attachment.md
---

# Custom Theme

- The editor allows you to create and apply custom themes to change its appearance according to your preferences.

- Reference shacne's custom theme implementation: [https://ui.shadcn.com/themes](https://ui.shadcn.com/themes)

## Usage

```javascript
import { themeActions, useTheme } from 'reactjs-tiptap-editor/theme'

// Set theme
themeActions.setTheme('light') // or 'dark';

// Set color
themeActions.setColor('default') //  "red" | "blue" | "green" | "orange" | "rose" | "violet" | "yellow"

// Set radius
themeActions.setRadius('0.5rem') // any valid CSS border-radius value

// Usage in a React component
const { theme, color, borderRadius } = useTheme();
console.log(theme, color, borderRadius);
```
