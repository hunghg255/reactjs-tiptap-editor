# Copilot Instructions for reactjs-tiptap-editor

## Architecture Overview

This is a modular rich-text editor library built on **Tiptap 3.x** with **Shadcn UI** patterns. It ships as a pnpm monorepo:

- `src/` - Main library source (published to npm)
- `playground/` - Development demo app
- `docs/` - Documentation site (VitePress)

### Key Design Decisions

- **Tree-shakable extensions**: Each of 40+ extensions is independently importable (`reactjs-tiptap-editor/bold`)
- **Tiptap-native**: Uses `@tiptap/react`'s `useEditor` hook directly—no custom wrapper
- **Signal-based state**: Uses `reactjs-signal` for theme, locale, and editor state
- **CSS isolation**: All Tailwind classes prefixed with `richtext-` (configured in `vite.config.ts` postcss)

## Extension Pattern

Extensions live in `src/extensions/{Name}/` with this structure:

```
src/extensions/Bold/
├── Bold.ts       # Extends Tiptap extension, adds `button` option
├── index.ts      # Re-exports (export * from './Bold')
└── components/   # Optional React components (RichTextBold toolbar item)
```

**Extension example** ([Bold.ts](../src/extensions/Bold/Bold.ts)):

```typescript
export const Bold = TiptapBold.extend<BoldOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t, extension }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleBold(),
          isActive: () => editor.isActive('bold'),
          icon: 'Bold',
          shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'B'],
          tooltip: t('editor.bold.tooltip'),
        },
      }),
    };
  },
});
```

When creating new extensions:

1. Extend the Tiptap extension using `@__PURE__` annotation for tree-shaking
2. Add `button` option returning `{ component, componentProps }` for toolbar integration
3. Export types extending `GeneralOptions<T>` from `src/types.ts`
4. Create matching `RichText{Name}` component for toolbar

## Component Patterns

UI components in `src/components/ui/` follow Shadcn conventions:

- Use Radix primitives (`@radix-ui/react-*`)
- Style with `class-variance-authority` (cva)
- Prefix all classes with `richtext-`

**Import alias**: `@/` maps to `src/` (see `vite.config.ts`)

## State Management

Uses `reactjs-signal` for reactive state:

```typescript
// src/store/store.ts pattern
const signal = createSignal<boolean>(false);
const useValue = () => useSignalValue(signal);
const useSetValue = () => useSetSignal(signal);
```

Theme and locale actions are exposed via:

- `reactjs-tiptap-editor/theme` → `themeActions.setTheme()`, `themeActions.setColor()`
- `reactjs-tiptap-editor/locale-bundle` → `localeActions.setLang()`

## Development Commands

```bash
pnpm install              # Install all workspace dependencies
pnpm build:lib:dev        # Build library with watch mode (required before playground)
pnpm playground           # Start playground dev server
pnpm build:lib            # Production build → outputs to lib/
pnpm lint && pnpm fmt     # Lint (oxlint) and format (oxfmt)
pnpm type-check           # TypeScript validation
pnpm docs:dev             # Run documentation site locally
```

## Build Output

Library builds to `lib/` with dual format:

- ESM: `lib/{Extension}.js`
- CJS: `lib/{Extension}.cjs`
- Types: `lib/extensions/{Extension}/index.d.ts`

Package exports are auto-generated from `src/extensions/*/` (see `vite.config.ts` glob logic).

## i18n

Translations in `src/locales/{lang}.ts`. Add new locale:

1. Create `src/locales/{lang}.ts` following `en.ts` structure
2. Register in `src/locales/index.ts` LANG.message object
3. Use `t('editor.{key}')` in components

## Testing Changes

Always test in playground after modifying extensions:

1. `pnpm build:lib:dev` (keep running)
2. `pnpm playground` (in another terminal)
3. Import your extension in `playground/src/App.tsx`
