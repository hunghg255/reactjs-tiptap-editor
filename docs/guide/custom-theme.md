---
description: Custom Theme

next:
  text: How to Migrate
  link: /guide/how-to-migrate.md
---

# Custom Theme

Use the theme actions to control the editor's light/dark appearance, accent palette, and corner radius. Import the editor stylesheet once before applying your own layout styles.

## Set an initial theme

Run these actions during client initialization, or from your application's theme-change handler:

```ts
import { themeActions } from 'reactjs-tiptap-editor/theme';

// These settings apply to the library's editor UI and dialogs.
themeActions.setTheme('dark');
themeActions.setColor('blue');
themeActions.setBorderRadius('0.5rem');
```

| Setting       | Supported values                                                                        | Default     |
| ------------- | --------------------------------------------------------------------------------------- | ----------- |
| Theme         | `'light'`, `'dark'`                                                                     | `'light'`   |
| Color         | `'default'`, `'red'`, `'blue'`, `'green'`, `'orange'`, `'rose'`, `'violet'`, `'yellow'` | `'default'` |
| Border radius | CSS length such as `'0px'` or `'0.5rem'`                                                | `'0.65rem'` |

The settings are shared by editor instances and their portaled dialogs. They are not per-editor props, and the library does not persist them across reloads. Restore preferences through your own application state if needed.

## Add a theme toggle

```tsx
import { themeActions, useTheme } from 'reactjs-tiptap-editor/theme';

export function EditorThemeToggle() {
  const { theme } = useTheme();

  return (
    <button
      type='button'
      onClick={() => themeActions.setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
}
```

`useTheme()` also returns `color` and `borderRadius`. Call it inside a React component. To follow your host application's appearance, invoke `setTheme` when that application's theme changes.

::: tip Migrating from the old editor
The current provider type still accepts `dark`, but the implementation does not apply it. Use `themeActions.setTheme` instead of `<RichTextProvider dark={...}>`.
:::

## Style the document area

Add a class to `EditorContent` in your existing editor:

```tsx
<EditorContent editor={editor} className='article-editor' />
```

Then define your layout in application CSS:

```css
.article-editor .tiptap {
  min-height: 240px;
  padding: 1rem;
}
```

Use editor-scoped selectors so these rules do not affect unrelated page content. Theme colors style the interface; inline text colors applied through the Color extension remain part of the document.

Diagrams and drawing tools can require additional stylesheets. Follow the [KaTeX](/extensions/Katex/), [Drawer](/extensions/Drawer/), and [Excalidraw](/extensions/Excalidraw/) setup instructions when enabling those features.
