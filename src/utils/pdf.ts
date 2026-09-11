import { type ExportPdfOptions } from '@/extensions/ExportPdf';

import type { Editor } from '@tiptap/core';

const CDN_STYLESHEET = 'https://cdn.jsdelivr.net/npm/reactjs-tiptap-editor@latest/lib/style.css';

/**
 * Minimal layout rules that must hold even if no external stylesheet loads
 * (offline, CSP, CDN blocked). Keeps multi-column content side by side
 * instead of collapsing into stacked blocks (see issue #177).
 */
const FALLBACK_PRINT_STYLES = `
  .columns {
    display: flex;
    width: 100%;
    gap: 8px;
    margin-top: 0.75em;
  }
  .columns .column {
    flex: 1 1 0%;
    min-width: 0;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 2px;
    box-sizing: border-box;
  }
  .columns .column p:first-of-type {
    margin-top: 0;
  }
`;

/**
 * Collect the stylesheets already loaded by the host page (the app imports
 * `reactjs-tiptap-editor/style.css`), so the print document uses the exact
 * same CSS version without depending on the network.
 */
function collectHostStyles(): string {
  if (typeof document === 'undefined') return '';

  return Array.from(document.querySelectorAll<HTMLElement>('style, link[rel="stylesheet"]'))
    .map((el) => {
      if (el instanceof HTMLLinkElement) {
        // skip browser-extension / non-web sheets that cannot load inside the iframe
        return /^https?:/.test(el.href) ? `<link rel="stylesheet" href="${el.href}">` : '';
      }
      return `<style>${el.textContent ?? ''}</style>`;
    })
    .join('\n');
}

function printHtml(content: string, exportPdfOptions: ExportPdfOptions) {
  const iframe: HTMLIFrameElement = document.createElement('iframe');
  iframe.setAttribute('style', 'position: absolute; width: 0; height: 0; top: 0; left: 0;');
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;

  if (!doc) return;

  const {
    paperSize,
    title = 'React Tiptap Editor',
    margins: { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
  } = exportPdfOptions;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${collectHostStyles()}
      <link rel="stylesheet" href="${CDN_STYLESHEET}">
      <style>
        ${FALLBACK_PRINT_STYLES}

        @media print {
          @page {
            size: ${paperSize};
            margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft}; /* top, right, bottom, left */
          }

          body {
            background: none;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-container {
            width: 100%;
            box-sizing: border-box;
          }

          .print-container .ProseMirror.ProseMirror.ProseMirror {
            padding: 0;
            min-height: 0;
          }

          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container reactjs-tiptap-editor">
        <div class="ProseMirror">
          ${content}
        </div>
      </div>
    </body>
    </html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  iframe.addEventListener('load', () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print failed', err);
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 50);
  });
}

export function printEditorContent(editor: Editor, exportPdfOptions: ExportPdfOptions) {
  const content = editor.getHTML();
  if (content) {
    printHtml(content, exportPdfOptions);
    return true;
  }
  return false;
}
