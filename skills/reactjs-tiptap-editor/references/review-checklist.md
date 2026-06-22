# Review Checklist

Use this before delivering generated code or reviewing a user's integration.

## Blocking Issues

- Missing `reactjs-tiptap-editor/style.css`.
- `EditorContent` uses a different editor instance from `RichTextProvider`.
- Toolbar or bubble components rendered outside `RichTextProvider`.
- A `RichText*` component is rendered but its extension is missing from `extensions`.
- Fake `URL.createObjectURL(file)` upload is used in production code without a note.
- Browser-only editor code placed in a Next.js server component.
- Import path or exported symbol does not exist in `references/extension-map.md` or source.

## Feature Pairing

Ask:

- Does `RichTextImage` pair with `Image`?
- Does `RichTextBubbleImage` pair with `Image`?
- Does `SlashCommandList` pair with `SlashCommand`?
- Do `RichTextUndo` and `RichTextRedo` pair with `History`?
- Does `RichTextBubbleCodeBlock` pair with `CodeBlock`?
- Does `RichTextTable` or `RichTextBubbleTable` pair with `Table`?

## Dependency/CSS Checks

- Image UI: `react-image-crop` installed and `react-image-crop/dist/ReactCrop.css` imported.
- CodeBlock lowlight: `highlight.js` and `lowlight` installed and `CodeBlock.configure({ lowlight })` used if syntax highlighting is needed.
- Giphy GIF search: `ImageGif.configure({ provider: 'giphy', API_KEY })` gets an API key from app config.
- Main editor CSS: `reactjs-tiptap-editor/style.css` imported once.

## TypeScript Checks

- Upload handlers return `Promise<string>`.
- `useEditor` can receive `content` and `onUpdate` for controlled-ish save flows.
- `RichTextProvider` may need `dark={...}` depending on local type definitions.
- Mention items expose the fields expected by the app's mention UI, usually `id`, `label`, and optional `avatar`.

## Output Checks

- Include complete imports in snippets.
- Keep examples minimal and feature-focused.
- Mention extra packages and CSS imports near the feature that needs them.
- Report verification commands run, or say they were not run.
