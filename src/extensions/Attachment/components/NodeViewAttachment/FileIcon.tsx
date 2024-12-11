import { LucideAudioLines, LucideFile, LucideImage, LucideSheet, LucideTableProperties, LucideVideo } from 'lucide-react'
import ReactDOMServer from 'react-dom/server'
import { normalizeFileType } from '@/utils/file'
import { ExportPdf } from '@/components/icons/ExportPdf'
import ExportWord from '@/components/icons/ExportWord'

function iconToProseMirror(icon: JSX.Element) {
  // Render SVG as a static string
  const svgString = ReactDOMServer.renderToStaticMarkup(icon)

  // Parse the string into ProseMirror-compatible structure
  const parser = new DOMParser()
  const svgDocument = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = svgDocument.documentElement

  const iconToReturn = [
    'svg',
    {
      ...Array.from(svgElement.attributes).reduce((acc: any, attr: any) => {
        acc[attr.name] = attr.value
        return acc
      }, {}),
    },
  ]

  Array.from(svgElement.childNodes).forEach((child: any) => {
    if (child.nodeType === 1) {
      // Element node
      const childElement = [
        child.tagName.toLowerCase(),
        Array.from(child.attributes).reduce((acc: any, attr: any) => {
          acc[attr.name] = attr.value
          return acc
        }, {}),
      ]

      if (child.textContent) {
        childElement.push(child.textContent)
      }

      iconToReturn.push(childElement)
    }
  })

  return iconToReturn
}

// React components for rendering directly in JSX
const icons = {
  audio: <LucideAudioLines />,
  video: <LucideVideo />,
  file: <LucideFile />,
  image: <LucideImage />,
  pdf: <ExportPdf />,
  word: <ExportWord />,
  excel: <LucideSheet />,
  ppt: <LucideTableProperties />,
}

export function getFileTypeIcon(fileType: string, forProseMirror = false) {
  const type = normalizeFileType(fileType)

  const icon = icons[type] || <></>

  // Return ProseMirror-compatible structure or React component
  return forProseMirror ? iconToProseMirror(icon) : icon
}
