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

  doc.open();
  doc.write(content);
  doc.close();

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://cdn.jsdelivr.net/npm/reactjs-tiptap-editor@latest/lib/style.css';
  doc.head.appendChild(link);

  iframe.addEventListener('load', function () {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 50);
  });
}

export function printEditorContent(editor: Editor) {
  const content = editor.getHTML();
  if (content) {
    printHtml(content);
    return true;
  }
  return false;
}
