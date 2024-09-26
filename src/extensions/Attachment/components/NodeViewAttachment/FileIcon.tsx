import { LucideAudioLines, LucideFile, LucideImage, LucideSheet, LucideTableProperties, LucideVideo } from 'lucide-react'
import { normalizeFileType } from '@/utils/file'
import { ExportPdf } from '@/components/icons/ExportPdf'
import ExportWord from '@/components/icons/ExportWord'

export function getFileTypeIcon(fileType: string) {
  const type = normalizeFileType(fileType)

  switch (type) {
    case 'audio':
      return <LucideAudioLines />

    case 'video':
      return <LucideVideo />

    case 'file':
      return <LucideFile />

    case 'image':
      return <LucideImage />

    case 'pdf':
      return <ExportPdf />

    case 'word':
      return <ExportWord />

    case 'excel':
      return <LucideSheet />

    case 'ppt':
      return <LucideTableProperties />

    default: {
      return <></>
    }
  }
}
