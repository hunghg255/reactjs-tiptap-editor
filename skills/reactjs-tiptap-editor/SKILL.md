---
name: reactjs-tiptap-editor
description: Integrate, configure, debug, migrate, refactor, and review React editors using reactjs-tiptap-editor. Use for its provider, extensions, toolbars, bubble menus, uploads, persistence, localization, theme, and document import/export. Applies when this package is requested or already used, not to generic Tiptap integrations using other UI libraries.
---

# Reactjs Tiptap Editor

Implement the requested behavior with the smallest compatible extension set. Preserve the host app's framework, package manager, data format, and editor ownership.

Preserve observable behavior unless the user requests a behavior change. Introduce abstractions only for actual independent responsibilities or variations.

## Establish the API version

Inspect the target app's manifest, lockfile, and editor setup. Infer framework and features from the project; ask only about missing product decisions such as the upload endpoint or persistence contract.

These references describe this repository's **1.0.46 / Tiptap 3** API. For another installed version, its exports and declarations take precedence. Do not silently upgrade dependencies or mix legacy default-editor/BaseKit examples with the provider API.

Verify unfamiliar imports and options using:

- `package.json` exports for public entry points.
- `src/index.ts`, `src/components/RichTextProvider.tsx`, and `src/extensions/<Feature>/index.ts` and implementation files in this repository.
- Installed package declarations in a consumer app. Use version-matched official documentation when local evidence is insufficient.

Do not copy private `@/` source aliases into consumer code or infer an import path from a component name.

## Load the relevant reference

| Task | Reference |
| --- | --- |
| Setup, SSR, dependencies, persistence | [quickstart.md](references/quickstart.md) |
| Exports, supporting nodes, toolbar and bubble imports | [extension-map.md](references/extension-map.md) |
| Uploads, slash commands, mentions, code blocks, export, locale, theme | [feature-recipes.md](references/feature-recipes.md) |
| Debugging or reviewing an integration | [review-checklist.md](references/review-checklist.md) |

Read only relevant sections. Feature recipes extend the quickstart; they are not standalone components.

## Implement

- Keep upload transport and save scheduling outside editor rendering and lifecycle code; wire app services through narrow callbacks.
- Add features through extension configuration and component composition, without feature-specific branches in the shared editor lifecycle.
- Preserve accepted inputs, result/error semantics, commands, and saved document compatibility when replacing callbacks or extending extensions.
- Give controls only the capabilities they use; do not require unrelated services or no-op callbacks for unavailable features.
- Share one `useEditor` instance between `RichTextProvider` and `EditorContent`. Guard the initial null editor before rendering the provider. Put context-dependent controls inside it.
- Import `reactjs-tiptap-editor/style.css` at the appropriate style boundary, plus selected feature CSS.
- Register commands and nodes required by visible controls. Check supporting schema nodes and extensions bundled by a feature before adding duplicates. If using StarterKit, disable overlaps or deliberately reuse existing equivalents.
- Keep static extensions outside the component and follow the app's lifecycle for dynamic callbacks. Avoid recreating the editor on each keystroke.
- Distinguish initial content from external document replacement. Save through `onUpdate`; changing the `content` option does not make the editor controlled.
- For SSR, use a client component and `immediatelyRender: false`; a client directive alone does not prevent server prerendering.
- Use the app's real upload contract. Return a persistent URL and reject failed responses. Object URLs are temporary previews, not saved media URLs.
- Prefer feature-specific bubble entry points and individual locale dictionaries when available in the installed version.

## Verify and deliver

Check imports, schema dependencies, provider nesting, and the requested interaction. Run relevant typechecks/builds or tests for executable changes; validate examples and links for documentation changes.

For debugging, reproduce the symptom and trace the owning extension, command, or state update before changing architecture. Use the review reference for likely failure points.

Deliver the patch or focused example with complete imports, necessary dependencies/CSS, and app-specific callback contracts. State what was verified and what remains untested. For reviews, lead with actionable findings and file locations.
