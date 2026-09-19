# Review and debugging

Use checks relevant to the reported symptom. Verify against the installed version first.

| Symptom | Check first |
| --- | --- |
| Import fails | Public exports, named symbol, installed version; avoid private source aliases |
| Missing styling | Main editor CSS, selected feature CSS, framework style entry |
| Control disabled or command missing | Provider context, editability, matching extension, current selection/schema |
| Schema error or duplicate plugin | Supporting nodes, duplicate extensions, StarterKit overlap, incompatible/duplicate Tiptap packages |
| Hydration error | Client boundary, immediatelyRender: false, initial null guard, browser APIs during prerender |
| Saved content never changes | onUpdate persistence callback and chosen HTML/JSON contract |
| External content stays stale | content is initialization; explicit document replacement or identity-based remount |
| Cursor jumps or update loop | Repeated setContent, recreated editor, parent echoing each local edit |
| Uploaded media disappears on reload | Temporary object URL, invalid response, missing persistent URL |
| Dark prop has no effect | This version ignores provider dark; use theme actions |
| Translations stay English | Register dictionary before setLang, or use compatibility locale bundle |

## Feature dependencies

- Provider and EditorContent must share an editor. Controls need their corresponding commands and extensions.
- BulletList and OrderedList need ListItem. Text-style features need TextStyle.
- Column needs Column, ColumnNode, and MultipleColumnNode.
- Table includes row/header/cell extensions; TaskList includes TaskItem. Avoid registering them twice.
- SlashCommandList needs SlashCommand; check dependencies of offered commands.
- Undo/redo need History or a compatible history mechanism. Check collaboration history before adding another one.
- Bubble text has no single matching extension: inspect its buttons. Feature bubbles need the corresponding node/mark.

## Feature checks

- Image crop CSS is available; directly imported CSS packages are declared by the app.
- Uploads return Promise<string>, reject unsuccessful responses, and provide persistent URLs. Confirm the endpoint contract rather than copying a fictional route.
- Mention data matches the list UI: id, label, optional avatar.
- Locale and theme stores are shared; check behavior if multiple editors need different settings.
- Read-only mode disables editing, not just toolbar rendering.

## Verification

When replacing an upload adapter, check successful URLs and rejected failures against the existing contract. When refactoring persistence, check external replacement does not echo-save and pending saves cannot overwrite a different document. When extending a node, reopen saved HTML/JSON and check attributes, commands, and undo behavior.

Use the host project's scripts. In this library, relevant commands include `pnpm type-check`, `pnpm test:types`, and `pnpm build:lib`; select those appropriate to the change. For a UI bug, reproduce the interaction and inspect the console. For persistence, save and reopen representative content.

Report actual checks and results, including limits. Documentation-only changes need example/import/link validation; do not claim browser testing without exercising the UI.
