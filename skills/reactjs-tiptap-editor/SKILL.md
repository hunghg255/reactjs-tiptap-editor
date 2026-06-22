---
name: reactjs-tiptap-editor
description: "Build, integrate, configure, debug, migrate, and review React rich-text editors using reactjs-tiptap-editor. Use for React Tiptap WYSIWYG editor setup, RichTextProvider, EditorContent, toolbar buttons, bubble menus, slash command, image upload, video upload, mentions, i18n, theme, export PDF/Word, CodeBlock lowlight, extension imports, and package usage. Triggers: 'use reactjs-tiptap-editor', 'add rich text editor', 'setup Tiptap editor', 'add toolbar', 'add image upload', 'configure slash command', 'customize editor theme', 'debug editor extension'."
---

IRON LAW: NEVER INVENT IMPORT PATHS, EXTENSION NAMES, OR OPTIONS. VERIFY THEM AGAINST THIS SKILL'S REFERENCES OR THE REPO BEFORE CODING.

## Workflow

Copy this checklist and check off items as you complete them:

```
Reactjs Tiptap Editor Progress:

- [ ] Step 1: Understand the integration target ⚠️ REQUIRED
  - [ ] 1.1 Identify framework, package manager, and existing Tiptap setup
  - [ ] 1.2 Identify requested features: base editor, toolbar, bubble menu, uploads, slash command, i18n, theme, export, custom extension
  - [ ] 1.3 Identify whether the task is code generation, code edit, review, migration, or debugging
- [ ] Step 2: Load exact references ⛔ BLOCKING
  - [ ] 2.1 Load references/quickstart.md for any setup or editor shell
  - [ ] 2.2 Load references/extension-map.md before using any extension import/component
  - [ ] 2.3 Load references/feature-recipes.md for uploads, slash command, i18n, theme, export, mentions, CodeBlock, bubble menu
  - [ ] 2.4 Load references/review-checklist.md before reviewing or delivering code
- [ ] Step 3: Plan the minimal implementation
  - [ ] 3.1 Decide the smallest extension set needed
  - [ ] 3.2 Pair every toolbar/bubble component with its required extension
  - [ ] 3.3 List extra peer packages/CSS imports required by selected features
- [ ] Step 4: Implement or answer
  - [ ] 4.1 Preserve the host app's React, CSS, and state-management patterns
  - [ ] 4.2 Use real upload/API callbacks supplied by the app; use object URLs only for demos
  - [ ] 4.3 Keep generated examples TypeScript-friendly
- [ ] Step 5: Verify ⚠️ REQUIRED
  - [ ] 5.1 Check imports against references/extension-map.md or source
  - [ ] 5.2 Check provider/editor nesting and CSS imports
  - [ ] 5.3 Run available typecheck/tests/build when editing a repo
```

## Usage Examples

- "Add reactjs-tiptap-editor to my React app with bold, italic, headings, lists, image upload, and slash command."
- "Review this editor setup and find why the toolbar button is disabled."
- "Show me how to configure i18n, dark theme, and export PDF/Word for reactjs-tiptap-editor."

## Step 1: Understand the Integration Target

Ask:

- Is the app using Vite, Next.js, Remix, or another React setup?
- Is there already a `useEditor` instance, `EditorContent`, or Tiptap extension array?
- Does the user need a runnable component, a patch in an existing file, or an explanation?
- Which output should be saved: HTML via `editor.getHTML()`, JSON via `editor.getJSON()`, or external state?
- Are selected features browser-only and therefore incompatible with server rendering without a client boundary?

For Next.js/App Router examples, mark the editor component as client-side with `'use client'` because Tiptap editor rendering is browser-oriented.

## Step 2: Load Exact References

Load only the references needed for the request:

- `references/quickstart.md`: base install, imports, provider structure, editor lifecycle.
- `references/extension-map.md`: extension import paths, toolbar components, bubble components, extra CSS/package notes.
- `references/feature-recipes.md`: upload callbacks, slash command, mention, i18n, theme, export, CodeBlock/lowlight, bubble menu.
- `references/review-checklist.md`: verification checklist for generated or reviewed code.

If a requested feature is not in the references, inspect the local repo docs/source before answering.

## Step 3: Plan the Minimal Implementation

Ask:

- Which extension nodes/marks are required for the user's visible UI?
- Is each `RichText*` toolbar component backed by the matching extension in `extensions`?
- Does any selected feature require extra package installs or CSS imports?
- Are upload callbacks returning a `Promise<string>` URL as expected?
- Is the generated example small enough to copy into an app without unrelated demo code?

Do not ask the user for confirmation when they clearly requested implementation. Do ask before overwriting existing editor architecture, changing package managers, or replacing app-wide styling.

## Step 4: Implement or Answer

Default structure for code:

1. Import `RichTextProvider` from `reactjs-tiptap-editor`.
2. Import `EditorContent` and `useEditor` from `@tiptap/react`.
3. Import required base Tiptap extensions.
4. Import selected `reactjs-tiptap-editor/<extension>` modules.
5. Import `reactjs-tiptap-editor/style.css` once in the editor entry or global style entry.
6. Build a stable `extensions` array.
7. Create `editor = useEditor({ extensions, content, textDirection: 'auto', onUpdate })`.
8. Render `<RichTextProvider editor={editor}>` around toolbar, bubble menu, slash command list, and `<EditorContent editor={editor} />`.

When editing an existing repo, follow existing file boundaries and naming. Avoid introducing a full demo app when the task only needs one feature added.

## Anti-Patterns

- Do not use `StarterKit` blindly when the requested setup already imports individual base extensions.
- Do not render `RichTextBold`, `RichTextImage`, `SlashCommandList`, or any `RichTextBubble*` component without adding the matching extension.
- Do not forget `reactjs-tiptap-editor/style.css`.
- Do not use fake upload handlers in production code unless the user asked for a demo.
- Do not import every extension "just in case"; it increases bundle size and may require unused peer packages.
- Do not invent undocumented options. Inspect source docs when the reference is incomplete.
- Do not put editor code in a server component without a client boundary.

## Output Style

For implementation answers:

- Show package installs only when dependencies are missing or feature-specific.
- Provide complete imports for code snippets.
- Mention any required extra CSS import.
- State which extensions and toolbar/bubble components were paired.

For reviews:

- Lead with bugs/risks and file references.
- Separate "must fix" from optional cleanup.

## Pre-Delivery Checklist

- [ ] No placeholder text remains in generated files or snippets.
- [ ] Every import path matches `references/extension-map.md` or repo source.
- [ ] Every toolbar/bubble UI component has its extension in the `extensions` array.
- [ ] `RichTextProvider` wraps all editor UI that uses editor context.
- [ ] `EditorContent` receives the same editor instance passed to `RichTextProvider`.
- [ ] `reactjs-tiptap-editor/style.css` is imported exactly once in the relevant app boundary.
- [ ] Feature-specific CSS/packages are called out.
- [ ] Upload callbacks return `Promise<string>` URLs.
- [ ] Verification commands were run or explicitly reported as not run.
