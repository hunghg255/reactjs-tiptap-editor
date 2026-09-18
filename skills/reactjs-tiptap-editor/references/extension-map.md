# Extension Map

Load this before adding imports, toolbar buttons, bubble menus, or extension arrays.

Snapshot: repository 1.0.46 / Tiptap 3. Public paths come from `package.json` exports; names come from source entry points. Installed-version declarations override this map.

## Base Extensions

| Purpose                                          | Import                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Document                                         | `import { Document } from '@tiptap/extension-document';`                                 |
| Text                                             | `import { Text } from '@tiptap/extension-text';`                                         |
| Paragraph                                        | `import { Paragraph } from '@tiptap/extension-paragraph';`                               |
| HardBreak                                        | `import { HardBreak } from '@tiptap/extension-hard-break';`                              |
| ListItem                                         | `import { ListItem } from '@tiptap/extension-list';`                                     |
| TextStyle                                        | `import { TextStyle } from '@tiptap/extension-text-style';`                              |
| Dropcursor, Gapcursor, Placeholder, TrailingNode | `import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';` |

## Main Extension Imports

| Feature          | Extension import                         | Toolbar/component import                                       |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------- |
| Attachment       | `reactjs-tiptap-editor/attachment`       | `Attachment`, `RichTextAttachment`                             |
| Blockquote       | `reactjs-tiptap-editor/blockquote`       | `Blockquote`, `RichTextBlockquote`                             |
| Bold             | `reactjs-tiptap-editor/bold`             | `Bold`, `RichTextBold`                                         |
| Bullet list      | `reactjs-tiptap-editor/bulletlist`       | `BulletList`, `RichTextBulletList`                             |
| Callout          | `reactjs-tiptap-editor/callout`          | `Callout`, `RichTextCallout`                                   |
| Clear formatting | `reactjs-tiptap-editor/clear`            | `Clear`, `RichTextClear`                                       |
| Code             | `reactjs-tiptap-editor/code`             | `Code`, `RichTextCode`                                         |
| Code block       | `reactjs-tiptap-editor/codeblock`        | `CodeBlock`, `RichTextCodeBlock`                               |
| Code view        | `reactjs-tiptap-editor/codeview`         | `CodeView`, `RichTextCodeView`                                 |
| Color            | `reactjs-tiptap-editor/color`            | `Color`, `RichTextColor`                                       |
| Column           | `reactjs-tiptap-editor/column`           | `Column`, `ColumnNode`, `MultipleColumnNode`, `RichTextColumn` |
| Drawer           | `reactjs-tiptap-editor/drawer`           | `Drawer`, `RichTextDrawer`                                     |
| Emoji            | `reactjs-tiptap-editor/emoji`            | `Emoji`, `RichTextEmoji`                                       |
| Excalidraw       | `reactjs-tiptap-editor/excalidraw`       | `Excalidraw`, `RichTextExcalidraw`                             |
| Export PDF       | `reactjs-tiptap-editor/exportpdf`        | `ExportPdf`, `RichTextExportPdf`                               |
| Export Word      | `reactjs-tiptap-editor/exportword`       | `ExportWord`, `RichTextExportWord`                             |
| Font family      | `reactjs-tiptap-editor/fontfamily`       | `FontFamily`, `RichTextFontFamily`                             |
| Font size        | `reactjs-tiptap-editor/fontsize`         | `FontSize`, `RichTextFontSize`                                 |
| Format painter   | `reactjs-tiptap-editor/formatpainter`    | `FormatPainter`, `RichTextFormatPainter`                       |
| Heading          | `reactjs-tiptap-editor/heading`          | `Heading`, `RichTextHeading`                                   |
| Highlight        | `reactjs-tiptap-editor/highlight`        | `Highlight`, `RichTextHighlight`                               |
| History          | `reactjs-tiptap-editor/history`          | `History`, `RichTextUndo`, `RichTextRedo`                      |
| Horizontal rule  | `reactjs-tiptap-editor/horizontalrule`   | `HorizontalRule`, `RichTextHorizontalRule`                     |
| Iframe           | `reactjs-tiptap-editor/iframe`           | `Iframe`, `RichTextIframe`                                     |
| Image            | `reactjs-tiptap-editor/image`            | `Image`, `RichTextImage`                                       |
| Image GIF        | `reactjs-tiptap-editor/imagegif`         | `ImageGif`, `RichTextImageGif`                                 |
| Import Word      | `reactjs-tiptap-editor/importword`       | `ImportWord`, `RichTextImportWord`                             |
| Indent           | `reactjs-tiptap-editor/indent`           | `Indent`, `RichTextIndent`                                     |
| Italic           | `reactjs-tiptap-editor/italic`           | `Italic`, `RichTextItalic`                                     |
| KaTeX            | `reactjs-tiptap-editor/katex`            | `Katex`, `RichTextKatex`                                       |
| Line height      | `reactjs-tiptap-editor/lineheight`       | `LineHeight`, `RichTextLineHeight`                             |
| Link             | `reactjs-tiptap-editor/link`             | `Link`, `RichTextLink`                                         |
| Markdown paste   | `reactjs-tiptap-editor/markdownpaste`    | `MarkdownPaste`                                                |
| Mention          | `reactjs-tiptap-editor/mention`          | `Mention`                                                      |
| Mermaid          | `reactjs-tiptap-editor/mermaid`          | `Mermaid`, `RichTextMermaid`                                   |
| More mark        | `reactjs-tiptap-editor/moremark`         | `MoreMark`, `RichTextMoreMark`                                 |
| Ordered list     | `reactjs-tiptap-editor/orderedlist`      | `OrderedList`, `RichTextOrderedList`                           |
| Search/replace   | `reactjs-tiptap-editor/searchandreplace` | `SearchAndReplace`, `RichTextSearchAndReplace`                 |
| Short message    | `reactjs-tiptap-editor/shortmessage`     | `ShortMessage`                                                 |
| Slash command    | `reactjs-tiptap-editor/slashcommand`     | `SlashCommand`, `SlashCommandList`                             |
| Strike           | `reactjs-tiptap-editor/strike`           | `Strike`, `RichTextStrike`                                     |
| Table            | `reactjs-tiptap-editor/table`            | `Table`, `RichTextTable`                                       |
| Task list        | `reactjs-tiptap-editor/tasklist`         | `TaskList`, `RichTextTaskList`                                 |
| Text align       | `reactjs-tiptap-editor/textalign`        | `TextAlign`, `RichTextAlign`                                   |
| Text direction   | `reactjs-tiptap-editor/textdirection`    | `TextDirection`, `RichTextTextDirection`                       |
| Underline        | `reactjs-tiptap-editor/textunderline`    | `TextUnderline`, `RichTextUnderline`                           |
| Twitter          | `reactjs-tiptap-editor/twitter`          | `Twitter`, `RichTextTwitter`                                   |
| Video            | `reactjs-tiptap-editor/video`            | `Video`, `RichTextVideo`                                       |
| AI               | `reactjs-tiptap-editor/ai`               | `AI` (bubble UI: `RichTextAIImprove` from `/bubble/ai`)         |
| Details          | `reactjs-tiptap-editor/details`          | `Details`, `DetailsSummary`, `DetailsContent`, `RichTextDetails` |
| Table of contents | `reactjs-tiptap-editor/tableofcontents` | `TableOfContents`, `TableOfContentsNode`, `RichTextTableOfContents`, `useTableOfContents` |
| Export Markdown  | `reactjs-tiptap-editor/exportmarkdown`   | `ExportMarkdown`, `RichTextExportMarkdown`, `getMarkdown`     |

For AI endpoint/protocol options, inspect `src/extensions/AI/types.ts` or installed declarations before configuring a backend. For Details/TableOfContents options, inspect their implementation and bundled child extensions rather than registering every exported node.

## Supporting Extensions

- BulletList and OrderedList require ListItem.
- Color, FontFamily, and FontSize use TextStyle.
- Register all three column extensions: Column, ColumnNode, MultipleColumnNode.
- Table registers TableRow, TableHeader, TableCell, and TableCellBackground internally.
- TaskList registers TaskItem internally; Details registers its summary/content nodes; TableOfContents registers its node internally.
- Check for overlaps with StarterKit and existing extensions before adding another registration.

## Non-Extension Imports

| Purpose           | Import                                                                            |
| ----------------- | --------------------------------------------------------------------------------- |
| Provider          | `import { RichTextProvider } from 'reactjs-tiptap-editor';`                       |
| Styles            | `import 'reactjs-tiptap-editor/style.css';`                                       |
| Bubble components | `import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble/text';`         |
| Locale            | `import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale';`        |
| Theme             | `import { themeActions, useTheme } from 'reactjs-tiptap-editor/theme';`           |

## Bubble Components

The compatibility barrel `reactjs-tiptap-editor/bubble` exports the following. Prefer the specific entry point when available to avoid pulling unrelated feature modules into the import graph:

- `RichTextBubbleText`
- `RichTextBubbleLink`
- `RichTextBubbleImage`
- `RichTextBubbleVideo`
- `RichTextBubbleTable`
- `RichTextBubbleIframe`
- `RichTextBubbleColumns`
- `RichTextBubbleImageGif`
- `RichTextBubbleDrawer`
- `RichTextBubbleExcalidraw`
- `RichTextBubbleMermaid`
- `RichTextBubbleTwitter`
- `RichTextBubbleCallout`
- `RichTextBubbleKatex`
- `RichTextBubbleCodeBlock`
- `RichTextBubbleMenuDragHandle`
- `RichTextAIImprove`

| Subpath (after `reactjs-tiptap-editor/`) | Named exports |
| --- | --- |
| `bubble/text` | `RichTextBubbleText` |
| `bubble/link` | `RichTextBubbleLink` |
| `bubble/media` | `RichTextBubbleImage`, `RichTextBubbleVideo`, `RichTextBubbleImageGif` |
| `bubble/table` | `RichTextBubbleTable` |
| `bubble/iframe` | `RichTextBubbleIframe` |
| `bubble/columns` | `RichTextBubbleColumns` |
| `bubble/drawer` | `RichTextBubbleDrawer` |
| `bubble/excalidraw` | `RichTextBubbleExcalidraw` |
| `bubble/mermaid` | `RichTextBubbleMermaid` |
| `bubble/twitter` | `RichTextBubbleTwitter` |
| `bubble/callout` | `RichTextBubbleCallout` |
| `bubble/katex` | `RichTextBubbleKatex` |
| `bubble/codeblock` | `RichTextBubbleCodeBlock` |
| `bubble/drag-handle` | `RichTextBubbleMenuDragHandle` |
| `bubble/ai` | `RichTextAIImprove` |

## Feature-Specific Package/CSS Notes

- Image crop UI: install `react-image-crop` and import `react-image-crop/dist/ReactCrop.css`.
- ImageGif with Giphy: configure `ImageGif.configure({ provider: 'giphy', API_KEY })`.
- Always import `reactjs-tiptap-editor/style.css`.
