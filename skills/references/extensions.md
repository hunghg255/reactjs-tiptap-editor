# Extensions Reference

All extensions follow the import pattern:
```tsx
import { ExtensionName, RichTextExtensionName } from 'reactjs-tiptap-editor/<lowercase-name>'
```

## Full Extension List

| Extension | Import Path | Toolbar Component | Notes |
|---|---|---|---|
| Attachment | `reactjs-tiptap-editor/attachment` | `RichTextAttachment` | Requires `upload` config |
| Blockquote | `reactjs-tiptap-editor/blockquote` | `RichTextBlockquote` | |
| Bold | `reactjs-tiptap-editor/bold` | `RichTextBold` | Shortcut: `mod+B` |
| BulletList | `reactjs-tiptap-editor/bulletlist` | `RichTextBulletList` | Shortcut: `shift+mod+8` |
| Callout | `reactjs-tiptap-editor/callout` | `RichTextCallout` | |
| Clear | `reactjs-tiptap-editor/clear` | `RichTextClear` | Clears editor content |
| Code | `reactjs-tiptap-editor/code` | `RichTextCode` | Inline code, shortcut: `mod+E` |
| CodeBlock | `reactjs-tiptap-editor/codeblock` | `RichTextCodeBlock` | Needs `prism-code-editor-lightweight` + extra CSS |
| CodeView | `reactjs-tiptap-editor/codeview` | `RichTextCodeView` | View raw HTML |
| Color | `reactjs-tiptap-editor/color` | `RichTextColor` | Text color |
| Column | `reactjs-tiptap-editor/column` | `RichTextColumn` | Multi-column layout |
| Drawer | `reactjs-tiptap-editor/drawer` | `RichTextDrawer` | |
| Emoji | `reactjs-tiptap-editor/emoji` | `RichTextEmoji` | |
| Excalidraw | `reactjs-tiptap-editor/excalidraw` | `RichTextExcalidraw` | Drawing canvas |
| ExportPdf | `reactjs-tiptap-editor/exportpdf` | `RichTextExportPdf` | |
| ExportWord | `reactjs-tiptap-editor/exportword` | `RichTextExportWord` | |
| FontFamily | `reactjs-tiptap-editor/fontfamily` | `RichTextFontFamily` | |
| FontSize | `reactjs-tiptap-editor/fontsize` | `RichTextFontSize` | |
| Heading | `reactjs-tiptap-editor/heading` | `RichTextHeading` | |
| Highlight | `reactjs-tiptap-editor/highlight` | `RichTextHighlight` | Background color highlight |
| History | `reactjs-tiptap-editor/history` | `RichTextUndo`, `RichTextRedo` | Two toolbar components |
| HorizontalRule | `reactjs-tiptap-editor/horizontalrule` | `RichTextHorizontalRule` | |
| Iframe | `reactjs-tiptap-editor/iframe` | `RichTextIframe` | Embed iframes |
| Image | `reactjs-tiptap-editor/image` | `RichTextImage` | Requires `upload` config |
| ImageGif | `reactjs-tiptap-editor/imagegif` | `RichTextImageGif` | GIF picker |
| ImportWord | `reactjs-tiptap-editor/importword` | `RichTextImportWord` | Import .docx files |
| Indent | `reactjs-tiptap-editor/indent` | `RichTextIndent` | |
| Italic | `reactjs-tiptap-editor/italic` | `RichTextItalic` | |
| Katex | `reactjs-tiptap-editor/katex` | `RichTextKatex` | Math formulas |
| LineHeight | `reactjs-tiptap-editor/lineheight` | `RichTextLineHeight` | |
| Link | `reactjs-tiptap-editor/link` | `RichTextLink` | |
| Mention | `reactjs-tiptap-editor/mention` | `RichTextMention` | @mentions |
| Mermaid | `reactjs-tiptap-editor/mermaid` | `RichTextMermaid` | Diagrams |
| MoreMark | `reactjs-tiptap-editor/moremark` | `RichTextMoreMark` | |
| OrderedList | `reactjs-tiptap-editor/orderedlist` | `RichTextOrderedList` | |
| SearchAndReplace | `reactjs-tiptap-editor/searchandreplace` | `RichTextSearchAndReplace` | |
| SlashCommand | `reactjs-tiptap-editor/slashcommand` | `SlashCommandList` | Press `/` in editor |
| Strike | `reactjs-tiptap-editor/strike` | `RichTextStrike` | |
| Table | `reactjs-tiptap-editor/table` | `RichTextTable` | |
| TaskList | `reactjs-tiptap-editor/tasklist` | `RichTextTaskList` | Checkboxes |
| TextAlign | `reactjs-tiptap-editor/textalign` | `RichTextTextAlign` | |
| TextDirection | `reactjs-tiptap-editor/textdirection` | `RichTextTextDirection` | LTR/RTL |
| TextUnderline | `reactjs-tiptap-editor/textunderline` | `RichTextTextUnderline` | |
| Twitter | `reactjs-tiptap-editor/twitter` | `RichTextTwitter` | Embed tweets |
| Video | `reactjs-tiptap-editor/video` | `RichTextVideo` | |

## CodeBlock Extra Setup

```tsx
import 'prism-code-editor-lightweight/layout.css'
import 'prism-code-editor-lightweight/themes/github-dark.css'
```

Trigger: type ` ``` ` then press Enter.

## Upload Config Pattern (Image & Attachment)

```tsx
Image.configure({
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    return url
  }
})
```
