# ShortMessage – Task List

## Task 1: Extension core + popup list

**Description:** Create `ShortMessage` extension that opens a Suggestion-driven list at the caret on a keyboard
shortcut (no trigger character). Includes the option/type definitions and the React list component. This task
validates the "reuse `@tiptap/suggestion` with custom `findSuggestionMatch` + storage anchor" approach.

**Acceptance criteria:**
- [x] `ShortMessage.configure({ messages: [...] })` compiles; pressing `Mod-Space` in a paragraph opens a list of all messages at the caret
- [x] Typing filters the list (case-insensitive on `short`, then `long_content`); ArrowUp/Down moves the highlight; Enter or click replaces the typed filter text with `long_content` and closes the popup; Escape closes without inserting and leaves typed text untouched
- [x] Popup also closes when the caret leaves the anchor's textblock or moves before the anchor; a second `Mod-Space` after closing re-opens cleanly (no zombie state, no swallowed keys)

**Verification:**
- [x] `pnpm type-check` passes
- [x] `pnpm lint` passes
- [x] Manual check: temporarily add the extension to `playground/src/App.tsx` via a relative import and run `pnpm playground`; exercise all criteria above, incl. Escape → keep typing → Mod-Space again

**Dependencies:** None

**Files likely touched:**
- `src/extensions/ShortMessage/ShortMessage.ts`
- `src/extensions/ShortMessage/types.ts`
- `src/extensions/ShortMessage/components/ShortMessageList.tsx`
- `src/extensions/ShortMessage/index.ts`

**Implementation notes:**
- `addOptions`: `{ messages: [], shortcut: 'Mod-Space', items: undefined }`
- `addStorage`: `{ anchor: null as number | null }`
- `addKeyboardShortcuts`: `[this.options.shortcut]: () => { if (!selection.empty) return false; storage.anchor = from; view.dispatch(state.tr); return true }`
- `addProseMirrorPlugins`: `Suggestion<ShortMessageItem>({ pluginKey: new PluginKey('shortMessage'), editor, char: '', allowSpaces: true, findSuggestionMatch: custom, items: this.options.items ?? defaultFilter, command: insert, render: wrapped renderNodeViewClosure(ShortMessageList) })`
- Wrap `render()` so `onExit` clears `storage.anchor`; on `Escape` clear anchor + `exitSuggestion(editor.view, pluginKey)`
- `ShortMessageList` follows `NodeViewMentionList` (forwardRef, `SuggestionHandle`, `data-richtext-portal`, same Tailwind `richtext-*` classes); each row shows `short` (font-medium) and `long_content` (muted, truncated)
- Empty state text: use `t('editor.shortMessage.empty')` (key added in Task 3; falls back to the key string until then)

**Estimated scope:** Medium (4 files)

---

## Task 2: Register the entry point

**Description:** Wire the new extension into the package build/export surface and the playground so it is
importable as `reactjs-tiptap-editor/shortmessage`.

**Acceptance criteria:**
- [x] `package.json` has `typesVersions["*"]["./shortmessage"]` and `exports["./shortmessage"]` (require/import, types + default) placed alphabetically between `searchandreplace` and `slashcommand`
- [x] `src/types.ts` `ExtensionNameKeys` includes `'shortMessage'`; `scripts/extensions.json` has the ShortMessage entry (same shape `pnpm gen-changelog` would generate)
- [x] `playground/src/App.tsx` imports `ShortMessage` from `reactjs-tiptap-editor/shortmessage` with 3–4 sample messages (replace the relative import from Task 1)

**Verification:**
- [x] `pnpm build:lib` succeeds and emits `lib/ShortMessage.js`, `lib/ShortMessage.cjs`, `lib/extensions/ShortMessage/index.d.ts`
- [x] `pnpm type-check` passes
- [x] Manual check: `pnpm playground` — Ctrl+Space flow works using the package import

**Dependencies:** Task 1

**Files likely touched:**
- `package.json`
- `src/types.ts`
- `scripts/extensions.json`
- `playground/src/App.tsx`

**Estimated scope:** Small (4 files, small edits)

---

## Checkpoint: After Tasks 1–2
- [x] `pnpm type-check`, `pnpm lint`, `pnpm fmt:check`, `pnpm build:lib` all pass
- [x] End-to-end flow verified in playground (open → filter → insert; open → Escape; reopen)
- [x] Review with human before proceeding

---

## Task 3: Locale key + public-types test

**Description:** Add the empty-state locale key to all locale files and a compile-time test covering the public
options shape.

**Acceptance criteria:**
- [x] `editor.shortMessage.empty` exists in `src/locales/en.ts` and is translated in `vi`, `zh-cn`, `ja`, `fi`, `hu`, `pt-br`
- [x] `tests/public-types.test.ts` has a `ShortMessage.configure({...})` call that compiles, plus a `// @ts-expect-error` case (e.g. `messages: [{ short: 1 }]`)

**Verification:**
- [x] `pnpm type-check` and `pnpm test:types` pass
- [x] `pnpm lint` passes
- [x] Manual check: empty-state text shows "No Result" (en) when filter matches nothing

**Dependencies:** Task 2

**Files likely touched:**
- `src/locales/en.ts`, `vi.ts`, `zh-cn.ts`, `ja.ts`, `fi.ts`, `hu.ts`, `pt-br.ts`
- `tests/public-types.test.ts`

**Estimated scope:** Small (8 files, one line each)

---

## Task 4: Docs page, sidebar nav, prev/next, extension-map

**Description:** Document the extension following the `docs/extensions/Mention/index.md` template and register
it in every place the repo lists extensions.

**Acceptance criteria:**
- [x] `docs/extensions/ShortMessage/index.md` with frontmatter (`description`, `next` → SlashCommand), Setup example (full `useEditor` + `RichTextProvider` snippet, `messages` config), "How to use" (shortcut, filtering, keys), "Options" (`messages`, `shortcut`, `items`), note about IME/OS shortcut collisions and HTML in `long_content`
- [x] `docs/extensions/SearchAndReplace/index.md` `next` points to ShortMessage; `docs/.vitepress/locale.ts` sidebar has `{ text: 'ShortMessage', link: '/extensions/ShortMessage/index.md' }` between SearchAndReplace and SlashCommand
- [x] `skills/reactjs-tiptap-editor/references/extension-map.md` has a row for `Short message` / `reactjs-tiptap-editor/shortmessage` / `ShortMessage`

**Verification:**
- [x] `pnpm docs:build` succeeds
- [x] Manual check: `pnpm docs:dev` — page renders, prev/next links resolve, sidebar entry visible

**Dependencies:** Task 2

**Files likely touched:**
- `docs/extensions/ShortMessage/index.md`
- `docs/extensions/SearchAndReplace/index.md`
- `docs/.vitepress/locale.ts`
- `skills/reactjs-tiptap-editor/references/extension-map.md`

**Estimated scope:** Small (4 files)

---

## Checkpoint: Complete
- [x] All tasks checked; `pnpm type-check && pnpm test:types && pnpm lint && pnpm fmt:check && pnpm build:lib && pnpm docs:build` pass
- [x] Playground demo works with the package import
- [x] Ready for review / commit (`feat: add short message extension`)
