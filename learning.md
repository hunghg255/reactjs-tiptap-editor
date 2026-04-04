# June Editor Learnings From `reactjs-tiptap-editor`

This note is for engineers working in:

- `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor`

Reference codebase:

- `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor`

## Summary

Do not copy the overall architecture of `reactjs-tiptap-editor`.

June already has the stronger product-specific editor shell and better separation between:

- durable content components
- runtime plugins and overlays

What is worth borrowing is narrower:

- simpler text-selection bubble positioning
- better feature packaging around rich blocks
- native ProseMirror/Tiptap drag semantics for in-editor block movement

## Learnings

- This package keeps many floating surfaces small and specific instead of making one toolbar own every editing state:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/docs/guide/bubble-menu.md:90`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/components/Bubble/RichTextBubbleText.tsx:171`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/components/Bubble/RichTextBubbleMermaid.tsx:76`
- Rich features are packaged as a full unit: extension, commands, insertion UI, and contextual edit UI:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/Mermaid/Mermaid.ts:10`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/Mermaid/components/RichTextMermaid.tsx:24`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/components/Bubble/RichTextBubbleExcalidraw.tsx:64`
- Search uses ProseMirror decorations and an active-result class, which is the right mechanism for highlight rendering:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/SearchAndReplace/SearchAndReplace.ts:97`
- The search UI also scrolls the active result into view, which June should copy:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/SearchAndReplace/components/RichTextSearchAndReplace.tsx:73`
- For real code-block behavior, this package relies on Tiptap's `CodeBlockLowlight` rather than a generic custom text node:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/CodeBlock/CodeBlock.ts:1`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/docs/extensions/CodeBlock/index.md:117`
- Draggable rich blocks participate in normal Tiptap/ProseMirror drag behavior via `data-drag-handle` and `draggable='true'`:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/Image/components/ImageView.tsx:240`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/Mermaid/components/NodeViewMermaid/NodeViewMermaid.tsx:222`
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/components/Bubble/RichTextBubbleMenuDragHandle.tsx:157`

## Issue 1: Floating Toolbar Positioning

### Conclusion

For the text-selection bubble specifically, `reactjs-tiptap-editor` likely positions better than June today.

June current config:

- `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/toolbar/floating-toolbar/floating-toolbar.tsx:118`
- `appendTo={() => document.body}`
- `strategy: 'fixed'`
- `placement: 'top'`
- `offset: { mainAxis: 25 }`
- `inline: true`

Reference package text bubble:

- `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/components/Bubble/RichTextBubbleText.tsx:171`
- `placement: 'bottom'`
- `offset: 8`
- no `inline: true`
- no body append

That difference can explain why a double-tap word selection and a drag-range selection feel like they have a different gap from the toolbar.

### Recommendation

Keep June's overall multi-surface architecture, but simplify the text-selection bubble positioning.

### Implementation

1. Treat the text-selection bubble as its own surface, not the template for all floating UI.
2. Test a config closer to the reference package for text selection only:
   - `placement: 'bottom'`
   - `offset: 8` or `10`
   - remove `inline: true`
3. Keep `appendTo(() => document.body)` and `strategy: 'fixed'` only if they are still needed after testing. They may be part of the inconsistency.
4. Keep node-specific controls separate instead of enlarging the main text bubble:
   - June table toolbar already follows this pattern:
     - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/toolbar/table-toolbar/table-toolbar.tsx:65`

## Issue 2: Search And Replace Highlighting

### Conclusion

June has the right mechanism on paper, but the user-visible feature is still broken and should be treated as an open bug.

Current June pieces:

- extension mounted in runtime editor extensions:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/plugins/index.ts:48`
- CSS imported in editor creation:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/core/create-editor.ts:14`
- decoration classes produced by the plugin:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/plugins/find-and-replace/find-and-replace.ts:155`
- highlight CSS:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/plugins/find-and-replace/find-and-replace-styles.css:1`
- mounted editor wrapper:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/note-editor.tsx:563`

Existing tests only prove that classes can be inserted in an isolated editor DOM:

- `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/plugins/find-and-replace/find-and-replace.test.ts:127`

They do not prove that the real mounted `NoteEditor` visibly highlights matches.

### Recommendation

Keep the decoration-based approach. Fix the end-to-end behavior instead of replacing the implementation.

### Implementation

1. Add an integration test around mounted `NoteEditor` that:
   - opens find
   - enters a search term
   - asserts `.note-editor-search-result` exists in the real editor DOM
2. While debugging the production issue, check these in order:
   - spans with `.note-editor-search-result` exist
   - the CSS from `find-and-replace-styles.css` is applied
   - the visual treatment is strong enough to notice
3. If the classes exist but the effect is too subtle, strengthen the CSS instead of rewriting the plugin.
4. Add active-result reveal behavior, following the reference package:
   - select active range
   - scroll active result into view
   - reference:
     - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/SearchAndReplace/components/RichTextSearchAndReplace.tsx:73`
5. Keep June's explicit ephemeral refresh transactions:
   - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/plugins/find-and-replace/find-and-replace.ts:64`

## Issue 3: Dragging Blocks Splits Paragraphs

### Conclusion

This is the strongest place to borrow from `reactjs-tiptap-editor`.

June currently mixes two different concerns:

- in-editor block movement
- OS/native file drag behavior

Current June code:

- image gallery is `atom: true` and `draggable: false`:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/image-gallery/extension.ts:9`
- custom native gallery drag hook:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/image-gallery/drag/use-gallery-drag.ts:29`
- custom gallery handle:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/image-gallery/node-view.tsx:379`
- drop position resolution:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/plugins/drag-drop/handle-file-drop.ts:25`
- raw block insertion during gallery moves/extraction:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/image-gallery/drag/gallery-transactions.ts:80`

Reference package:

- image node drag handle:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/Image/components/ImageView.tsx:240`
- Mermaid node drag handle:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/Mermaid/components/NodeViewMermaid/NodeViewMermaid.tsx:222`

The likely bug source in June is that a gallery block is being inserted at a position that is structurally valid for ProseMirror, but not semantically the block boundary UX we want. That can split a paragraph when dropping below it.

### Recommendation

Use native Tiptap/ProseMirror dragging for in-editor block reordering. Keep native drag only for OS/file transfers.

### Implementation

1. Split drag flows into two explicit intents:
   - `inEditorBlockDrag`
   - `externalFileDrag`
2. For whole-gallery reordering:
   - make the gallery node draggable in the editor
   - expose a real ProseMirror drag handle in the node view
3. Keep native drag only for:
   - dragging files/images out of the app
   - dragging files/images into the app from Finder or other apps
4. For any path that still inserts a gallery block manually, do not insert at arbitrary `insertPos`.
5. Add one block-safe insertion helper that normalizes the destination to a top-level block boundary, and route all gallery move/extract insertions through it.
6. Treat the drop indicator as visual only. The insertion helper must be the final source of truth.

## Issue 4: Article Codeblock Interaction Is Wrong

### Conclusion

June's `subArticleCode` is not implemented as a real code-block-style node, so it does not get code-block interaction semantics.

Current June implementation:

- node schema:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/sub-article-code/extension.ts:6`
- node view:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/sub-article-code/node-view.tsx:5`

Key details:

- `content: 'text*'`
- custom node view with `NodeViewContent`
- no code-block extension base
- no keyboard handling for Enter/newline behavior

That strongly suggests the current behavior is expected from the implementation: pressing Enter is handled like a generic block split, so the node is split into another `subArticleCode` block instead of inserting a newline inside the same code block.

Reference package:

- uses `CodeBlockLowlight` via its `CodeBlock` extension:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/extensions/CodeBlock/CodeBlock.ts:1`
- docs explicitly expect code-block behavior from triple backticks plus Enter:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/docs/extensions/CodeBlock/index.md:117`

### Recommendation

If `subArticleCode` is supposed to behave like a code block, it should be built on top of Tiptap's code-block semantics, not as a generic custom text node.

### Implementation

1. Decide whether `subArticleCode` is:
   - a true code block with special metadata
   - or a custom visual block that only looks like code
2. If it is a true code block, reimplement it by extending Tiptap's code-block extension instead of `Node.create({ content: 'text*' })`.
3. Preserve June-specific serialization and styling, but inherit code-block interaction behavior from the proper base extension.
4. If a full rebase is not possible immediately, add explicit keyboard handling so Enter inserts a newline inside the node instead of splitting the block.
5. Add tests for:
   - Enter inside the middle of the block
   - Enter at the end of the block
   - exiting the block with the expected shortcut only

## Issue 5: Drag Handle Support

### Conclusion

June has partial prerequisites for drag handles on some nodes, but it does not yet have a consistent editor-level drag-handle system.

Current June code:

- `subArticleCode` is `draggable: true` and marked with `data-drag-handle`:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/sub-article-code/extension.ts:10`
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/sub-article-code/node-view.tsx:9`
- `meetingTranscript` also follows this pattern:
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/meeting-transcript/extension.ts:57`
  - `/Users/chantakyu/Applications/pdir/June-Core/apps/desktop/src/editor/components/meeting-transcript/view.tsx:20`

What is missing compared with the reference package:

- an editor-level drag-handle UI/plugin:
  - `/Users/chantakyu/Applications/pdir/reactjs-tiptap-editor/src/components/Bubble/RichTextBubbleMenuDragHandle.tsx:157`
- a consistent visible grip/handle experience across draggable blocks
- one shared pattern for click-for-menu vs hold-to-drag behavior

### Recommendation

Standardize drag handles as a first-class editor feature instead of leaving them as per-node ad hoc markers.

### Implementation

1. Keep using node-level prerequisites where needed:
   - `draggable: true`
   - `data-drag-handle`
2. Add one shared drag-handle system at the editor layer for block nodes that support dragging.
3. Start with the nodes that already opt in:
   - `subArticleCode`
   - `meetingTranscript`
4. Then bring `imageGallery` onto the same system once block dragging is separated from native file dragging.
5. Define one shared UX rule:
   - visible grip or hover handle
   - drag starts only from the handle
   - optional contextual menu from the same anchor
6. Do not keep separate drag models for each node type unless the node truly needs custom behavior.

## Implementation Order

1. Floating toolbar: simplify text-selection bubble positioning first.
2. Search: make highlighting visible end to end, then add active-result reveal.
3. Dragging: separate block drag from native file drag, then move gallery reorder onto native ProseMirror/Tiptap drag semantics.
4. Article codeblock: rebase `subArticleCode` onto real code-block semantics or add explicit newline handling immediately.
5. Drag handle: standardize one shared drag-handle system for draggable block nodes.
