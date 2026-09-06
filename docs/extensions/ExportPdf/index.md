---
description: Export PDF

next:
  text: ExportWord
  link: /extensions/ExportWord/index.md
---

# Export PDF

Open the browser’s print flow for the editor content.

## Setup

Start with the packages in [Getting Started](/guide/getting-started). This complete example registers the feature and renders its UI. In an existing editor, merge the imports and extension entries into your setup, and place the controls inside your existing `RichTextProvider`.

```tsx
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import 'reactjs-tiptap-editor/style.css';

const extensions = [Document, Paragraph, Text, ExportPdf];

export default function ExportPdfExample() {
  const editor = useEditor({
    extensions,
    content: '<p>Try this feature here.</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextProvider editor={editor}>
      <RichTextExportPdf />
      <EditorContent editor={editor} />
    </RichTextProvider>
  );
}
```

## How to use

Click the toolbar button, then choose the browser’s PDF destination if available. This uses browser printing rather than returning a PDF Blob. Configure paper size and margins below, and review the print preview because the browser controls the final output.

---

## Options

### paperSize

Type: `PaperSize`

Default: `'Letter'`

Specifies the size of the paper used when exporting to PDF.

Supported values:

```ts
type PaperSize = 'Legal' | 'Letter' | 'Tabloid' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
```

### margins

Type:

```ts
{
  top: PageMargin;
  right: PageMargin;
  bottom: PageMargin;
  left: PageMargin;
}
```

Default:

```ts
{
  top: '0.4in',
  right: '0.4in',
  bottom: '0.4in',
  left: '0.4in'
}
```

Controls the page margins on all four sides. Values can be provided in inches (`in`), centimeters (`cm`), millimeters (`mm`), or points (`pt`).

Supported values:

```ts
type PageMargin =
  // Inches
  | '0in'
  | '0.25in'
  | '0.4in'
  | '0.5in'
  | '0.75in'
  | '1in'
  | '1.25in'
  | '1.5in'
  | '1.75in'
  | '2in'
  // Centimeters
  | '0cm'
  | '0.5cm'
  | '1cm'
  | '1.5cm'
  | '2cm'
  | '2.5cm'
  | '3cm'
  | '4cm'
  | '5cm'
  // Millimeters
  | '0mm'
  | '5mm'
  | '10mm'
  | '15mm'
  | '20mm'
  | '25mm'
  | '30mm'
  | '40mm'
  | '50mm'
  // Points
  | '0pt'
  | '18pt'
  | '36pt'
  | '54pt'
  | '72pt'
  | '90pt'
  | '108pt'
  | '144pt';
```

Example usage:

```ts
import { ExportPdf } from 'reactjs-tiptap-editor/exportpdf';

ExportPdf.configure({
  paperSize: 'A4',
  margins: {
    top: '1in',
    right: '0.4in',
    bottom: '1in',
    left: '0.4in',
  },
});
```
