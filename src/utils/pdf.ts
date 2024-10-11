import type { Editor } from '@tiptap/core'

function printHtml(content: string) {
  const iframe: HTMLIFrameElement = document.createElement('iframe')
  iframe.setAttribute('style', 'position: absolute; width: 0; height: 0; top: 0; left: 0;')
  document.body.appendChild(iframe)

  iframe.textContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Echo Editor</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body class="is-print">
      <div class="tiptap ProseMirror" translate="no" aria-expanded="false">
          ${content}
      </div>
    </body>
    </html>
  `

  const frameWindow = iframe.contentWindow
  const doc: any = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document)

  // load style from CDN to iframe
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdn.jsdelivr.net/npm/reactjs-tiptap-editor@latest/lib/style.css'
  doc.head.appendChild(link)

  if (doc) {
    doc.open()
    doc.write(content)
    doc.close()
  }

  if (frameWindow) {
    iframe.onload = function () {
      try {
        setTimeout(() => {
          frameWindow.focus()
          try {
            if (!frameWindow.document.execCommand('print', false)) {
              frameWindow.print()
            }
          }
          catch {
            frameWindow.print()
          }
          frameWindow.close()
        }, 10)
      }
      catch (err) {
        console.error(err)
      }

      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 100)
    }
  }
}

export function printEditorContent(editor: Editor) {
  const content = editor.getHTML()

  if (content) {
    printHtml(content)
    return true
  }
  return false
}
