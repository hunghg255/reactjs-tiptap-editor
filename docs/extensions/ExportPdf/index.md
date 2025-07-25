---
description: Export PDF

next:
  text: Import Word
  link: /extensions/ImportWord/index.md
---

# Export PDF

- Export PDF Extension for Tiptap Editor.

## Usage

```tsx
import { ExportPdf } from 'reactjs-tiptap-editor/exportpdf'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
   ExportPdf, // [!code ++]
];
```

Here’s the documentation in the same style:

---

## Options

### paperSize

Type: `PaperSize`
Default: `'Letter'`

Specifies the size of the paper used when exporting to PDF.

Supported values:

```ts
type PaperSize =
  | 'Legal'
  | 'Letter'
  | 'Tabloid'
  | 'A0'
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5';
```

---

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
  paperSize: 'Letter',
  margins: {
    top: '1in',
    right: '1in',
    bottom: '1in',
    left: '1in',
  },
});
```
