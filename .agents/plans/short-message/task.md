# Implementation Plan: ShortMessage extension

## Overview

Add a new `ShortMessage` extension (`reactjs-tiptap-editor/shortmessage`). The consumer configures a list of
snippets `[{ short: 'nsfw', long_content: 'Not safe forward' }]` at setup time. Pressing a keyboard shortcut
(default `Mod-Space`, i.e. Ctrl+Space / Cmd+Space) opens a floating list at the caret. The user can keep
typing to filter by `short`, navigate with Arrow keys, press Enter (or click) to replace the typed filter
text with `long_content`, or Escape to dismiss. No toolbar button; the shortcut is the only entry point.

## Public API (target)

```ts
import { ShortMessage } from 'reactjs-tiptap-editor/shortmessage';

ShortMessage.configure({
  messages: [
    { short: 'nsfw', long_content: 'Not safe forward' },
    { short: 'brb',  long_content: 'Be right back' },
  ],
  shortcut: 'Mod-Space',            // optional, default 'Mod-Space'
  // optional: override the default filter (sync or async)
  items: ({ query, editor }) => Promise<ShortMessageItem[]> | ShortMessageItem[],
});
```

```ts
export interface ShortMessageItem { short: string; long_content: string }
export interface ShortMessageOptions {
  messages: ShortMessageItem[];
  shortcut: string;
  items?: (props: { query: string; editor: Editor }) => ShortMessageItem[] | Promise<ShortMessageItem[]>;
}
```

## Architecture Decisions

- **Reuse `@tiptap/suggestion` instead of a hand-written ProseMirror plugin.** Suggestion v3 (installed 3.29.2)
  exposes `findSuggestionMatch` override and `exitSuggestion(view, pluginKey)`. The extension keeps
  `storage.anchor: number | null`. The shortcut sets `anchor = selection.from` and dispatches an empty
  transaction; the custom `findSuggestionMatch` returns `{ range: { from: anchor, to: $position.pos },
  query, text }` while `anchor` is set and the caret is still in the same textblock after the anchor, else
  `null`. This gives us positioning, keyboard routing, async `items`, and `command` range handling for free,
  matching how `Mention`, `Emoji`, and `SlashCommand` already work in this repo.
  - Considered: custom PM plugin + `ReactRenderer` (~150 lines, full control). Kept as fallback if the
    Suggestion approach shows lifecycle problems in Task 1 (see Risks).
- **Popup rendering** via the existing `renderNodeViewClosure(ShortMessageList)` (`src/utils/renderNodeView.ts`)
  so styling/positioning match `SlashCommandNodeView`. Wrap the returned renderer so `onExit` and `Escape`
  clear `storage.anchor` and call `exitSuggestion` (otherwise the plugin stays "active" with no renderer).
- **Insertion**: `editor.chain().focus().deleteRange(range).insertContent(props.long_content).run()`.
  `insertContent` with a string parses HTML, so `long_content` may contain simple markup; document this.
- **Default filter**: case-insensitive `short.includes(query)` OR `long_content.includes(query)`, `short`
  prefix matches first. Empty query returns all messages. `items` option overrides it entirely.
- **Extension name** `shortMessage`, `ExtensionNameKeys` entry `'shortMessage'`, `priority: 200` like
  `SlashCommand` so its keymap runs before defaults.
- **Locale**: one new key `editor.shortMessage.empty` (empty-state text). `t()` falls back to `en`, so only
  `en.ts` is required; add translations to the other 6 locale files in the same task for completeness.
- **No toolbar button** and no `button` option — out of scope per the request.

## Files

New:
- `src/extensions/ShortMessage/ShortMessage.ts` – extension (options, storage, keymap, Suggestion plugin)
- `src/extensions/ShortMessage/types.ts` – `ShortMessageItem`, `ShortMessageOptions`
- `src/extensions/ShortMessage/components/ShortMessageList.tsx` – popup list (forwardRef, `SuggestionHandle`)
- `src/extensions/ShortMessage/index.ts` – `export * from './ShortMessage'`
- `docs/extensions/ShortMessage/index.md`

Modified:
- `package.json` – `typesVersions["*"]["./shortmessage"]` and `exports["./shortmessage"]` (alphabetical, between `searchandreplace` and `slashcommand`)
- `src/types.ts` – `ExtensionNameKeys` add `'shortMessage'`
- `scripts/extensions.json` – entry `{ name: 'ShortMessage.ts', package: 'ShortMessage', alias: ['ShortMessage'] }`
- `src/locales/{en,vi,zh-cn,ja,fi,hu,pt-br}.ts` – `editor.shortMessage.empty`
- `docs/.vitepress/locale.ts` – sidebar entry
- `docs/extensions/SearchAndReplace/index.md` – `next` → ShortMessage; new doc `next` → SlashCommand
- `skills/reactjs-tiptap-editor/references/extension-map.md` – row for ShortMessage
- `playground/src/App.tsx` – demo config
- `tests/public-types.test.ts` – compile-time check of `ShortMessage.configure` payload

## Task List

Tasks are tracked in `.agents/plans/short-message/todo.md`.

### Phase 1: Core (high-risk first)
- [x] Task 1: Extension core + popup list (Suggestion reuse spike)
- [x] Task 2: Register the entry point (package.json, types, scripts, playground)

### Checkpoint: Core
- [x] `pnpm type-check`, `pnpm lint`, `pnpm build:lib` pass; `lib/ShortMessage.js` + `.cjs` emitted
- [x] In playground: Ctrl+Space opens list, typing filters, Enter inserts, Esc closes

### Phase 2: Polish
- [x] Task 3: Locale key + public-types test
- [x] Task 4: Docs page, sidebar nav, prev/next links, extension-map

### Checkpoint: Complete
- [x] All acceptance criteria met, `pnpm docs:build` passes
- [x] Ready for review / commit

## Verification commands

- Types: `pnpm type-check` and `pnpm test:types`
- Lint/format: `pnpm lint` and `pnpm fmt:check`
- Build: `pnpm build:lib` (check `lib/ShortMessage.js`, `lib/ShortMessage.cjs`, `lib/extensions/ShortMessage/index.d.ts`)
- Manual: `pnpm playground`

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Suggestion plugin keeps `active` state after our renderer is destroyed on Escape (zombie popup / swallowed keys) | High | Task 1 wraps `onKeyDown`/`onExit` to clear `storage.anchor` and call `exitSuggestion`; if lifecycle is still flaky, fall back to a custom PM plugin (decision recorded above). Task 1 is first for this reason. |
| Anchor becomes invalid when the caret leaves the textblock, doc changes above the anchor, or selection is non-empty | Med | `findSuggestionMatch` returns `null` unless `anchor <= pos`, same `$position.parent`, and `anchor >= $position.start()`; re-validate on every match instead of trying to map the anchor. |
| `Ctrl+Space` is grabbed by the OS/IME on some machines (Windows IME toggle, macOS input-source switch) | Med | `shortcut` option is configurable; docs call this out and suggest e.g. `Mod-Shift-Space`. |
| Long lists of messages | Low | List container reuses `max-h` + `overflow-y-auto` classes from `SlashCommandNodeView`; async `items` allowed. |
| `insertContent` parsing `long_content` as HTML surprises users with `<` in text | Low | Document; escaping is the consumer's responsibility (consistent with other extensions). |

## Decisions taken during implementation

- `long_content` is inserted via `insertContent(string)` (HTML-capable). Documented.
- Default shortcut stays `Mod-Space`; docs recommend `Mod-Shift-Space` when IME collisions matter.
- Added `onBlur` handling: Suggestion's `dismissOnOutsideClick` only works with its `mount()` API, which
  `renderNodeViewClosure` does not use, so the extension closes the list itself when the editor loses focus.
