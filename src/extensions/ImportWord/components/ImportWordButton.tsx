import type { Editor } from '@tiptap/core'

import { useRef, useState } from 'react'
import mammoth from 'mammoth'

import { useLocale } from '@/locales'
import { ActionButton, useToast } from '@/components'
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

interface ImportWordButtonProps {
  editor: Editor
  disabled?: boolean
  icon?: string
  tooltip?: string
  shortcutKeys?: string[]
  action?: () => boolean
  convert?: (file: File) => Promise<string>
  limit?: number
  mammothOptions?: any
}

function ImportWordButton(props: ImportWordButtonProps) {
  const { toast } = useToast()
  const { t } = useLocale()
  const [loading, setLoading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  function triggerFileInput() {
    fileInput.current?.click()
  }

  function handleFileChange(event: any) {
    const file = event.target.files[0]
    if (!file) {
      return
    }
    if (file.size > props.limit!) {
      toast({
        variant: 'destructive',
        title: t('editor.importWord.limitSize'),
      })
      return
    }
    importWord(file)
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
        extension => extension.name === 'importWord',
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

  async function importWord(importFile: File) {
    setLoading(true)
    try {
      if (props.convert) {
        const result = await props.convert(importFile)
        handleResult(result)
      }
      else {
        const arrayBuffer = await importFile.arrayBuffer()
        // TODO: add messages
        const { value } = await mammoth.convertToHtml(
          { arrayBuffer },
          props?.mammothOptions,
        )
        handleResult(value)
      }
    }
    finally {
      setLoading(false)
    }
  }
  async function handleResult(htmlResult: string) {
    const html = await filerImage(htmlResult)
    props.editor.chain().setContent(html, true).run()
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
