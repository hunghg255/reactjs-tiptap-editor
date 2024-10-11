import React, { useRef, useState } from 'react'
import { ActionButton } from '@/components'
import { hasExtension } from '@/utils/utils'

function base64ToBlob(base64: any, mimeType: any) {
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = Array.from({ length: byteCharacters.length })
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers as any)
  return new Blob([byteArray], { type: mimeType })
}

function blobToFile(blob: any, fileName: any) {
  return new File([blob], fileName, { type: blob.type })
}

function ImportWordButton(props: any) {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<any>()
  const fileInput: any = useRef()

  function triggerFileInput() {
    fileInput.current.click()
  }

  function handleFileChange(event: any) {
    const f = event.target.files[0]
    setFile(f)
    if (f) {
      importWord()
    }
  }

  async function filerImage(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const images = doc.querySelectorAll('img')
    if (!images.length) {
      return doc.body.innerHTML
    }
    const hasImage = hasExtension(props.editor, 'image')
    if (hasImage) {
      const uploadOptions = props.editor.extensionManager.extensions.find(
        (extension: any) => extension.name === 'importWord',
      )?.options
      if (uploadOptions && typeof uploadOptions.upload === 'function') {
        const files: File[] = []
        // convert base64 image to blob file
        for (const img of images) {
          const originalSrc = img.getAttribute('src')
          const blob = base64ToBlob(originalSrc, 'image/jpeg')
          const file = blobToFile(blob, 'image.jpeg')
          files.push(file)
        }
        const uploadRes = await uploadOptions.upload(files)
        // images
        for (let i = 0; i < images.length; i++) {
          const img = images[i]
          img.setAttribute('src', uploadRes[i].src)
          const parent = img.parentElement
          if (parent?.tagName === 'P') {
            parent.insertAdjacentElement('beforebegin', img)
            if (!parent.hasChildNodes() && parent.textContent === '') {
              parent.remove()
            }
          }
        }
        return doc.body.innerHTML
      }
      else {
        console.warn('Image Upload method found, skip image conversion')
        return doc.body.innerHTML
      }
    }
    else {
      console.error('Image extension not found, unable to convert image')
      return doc.body.innerHTML
    }
  }

  async function importWord() {
    if (props.convert) {
      const result = await props.convert(file)
      handleResult(result)
    }
    else {
      const formData = new FormData()
      const config = JSON.stringify({
        collaboration_features: {
          comments: true,
          user_id: 'e3',
          track_changes: true,
        },
        formatting: {
          resets: 'none',
          defaults: 'inline',
          styles: 'inline',
          comments: 'basic',
        },
      })
      formData.append('config', config)
      formData.append('file', file)
      setLoading(true)
      fetch('https://docx-converter.cke-cs.com/v2/convert/docx-html', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(async (data) => {
          handleResult(data.html)
        })
        .catch((error) => {
          console.error('Error:', error)
          setLoading(false)
        })
    }
  }
  async function handleResult(htmlResult: string) {
    const html = await filerImage(htmlResult)
    props.editor.chain().setContent(html, true).run()
    setLoading(false)
  }

  return (
    <div>
      <ActionButton loading={loading} disabled={props?.disabled} icon={props?.icon} tooltip={props?.tooltip} action={triggerFileInput} />
      <input
        type="file"
        accept=".docx"
        ref={fileInput}
        style={{
          display: 'none',
        }}
        onChange={handleFileChange}
      />
    </div>
  )
}

export default ImportWordButton
