import type { Editor } from '@tiptap/core';

function printHtml(content: string) {
  const iframe: HTMLIFrameElement = document.createElement('iframe');
  iframe.setAttribute(
    'style',
    'position: absolute; width: 0; height: 0; top: 0; left: 0;'
  );
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Echo Editor</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media print {
          @page {
            size: Letter;
            margin: 0.4in 0.4in 0.4in 0.4in;
          }

          body {
            background: none;
            margin: 0;
            padding: 0;
          }

          .print-container {
            width: 100%;
            box-sizing: border-box;
          }

          .no-print {
            display: none;
          }
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reactjs-tiptap-editor@latest/lib/style.css">
    </head>
    <body>
      <div class="print-container">
        ${content}
      </div>
    </body>
    </html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
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
  };
}

export function printEditorContent(editor: Editor) {
  const content = editor.getHTML();
  if (content) {
    printHtml(content);
    return true;
  }
  return false;
}
