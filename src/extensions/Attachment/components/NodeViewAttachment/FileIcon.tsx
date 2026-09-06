import {
  LucideAudioLines,
  LucideFile,
  LucideImage,
  LucideSheet,
  LucideTableProperties,
  LucideVideo,
} from 'lucide-react';
// import ReactDOMServer from 'react-dom/server';

import { ExportPdf } from '@/components/icons/ExportPdf';
import ExportWord from '@/components/icons/ExportWord';
import { FileIconString } from '@/extensions/Attachment/components/NodeViewAttachment/FileIconString';
import { normalizeFileType } from '@/utils/file';

function iconToProseMirror(typeIcon: import('@/utils/file').FileType) {
  // Render SVG as a static string
  const svgString = FileIconString[typeIcon];

  // Parse the string into ProseMirror-compatible structure
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svgDocument.documentElement;

  const iconToReturn: [
    string,
    Record<string, string>,
    ...import('@tiptap/pm/model').DOMOutputSpec[],
  ] = [
    'svg',
    {
      ...Array.from(svgElement.attributes).reduce((acc: Record<string, string>, attr: Attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
    },
  ];

  Array.from(svgElement.childNodes).forEach((child) => {
    if (child instanceof Element) {
      // Element node
      const childElement: [string, Record<string, string>, ...string[]] = [
        child.tagName.toLowerCase(),
        Array.from(child.attributes).reduce((acc: Record<string, string>, attr: Attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
      ];

      if (child.textContent) {
        childElement.push(child.textContent);
      }

      iconToReturn.push(childElement);
    }
  });

  return iconToReturn;
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
};

export function getFileTypeIcon(
  fileType: string,
  forProseMirror: true
): import('@tiptap/pm/model').DOMOutputSpec;
export function getFileTypeIcon(fileType: string, forProseMirror?: false): React.ReactElement;
export function getFileTypeIcon(
  fileType: string,
  forProseMirror = false
): React.ReactElement | import('@tiptap/pm/model').DOMOutputSpec {
  const type = normalizeFileType(fileType);

  const icon = icons[type] || <></>;

  // Return ProseMirror-compatible structure or React component
  return forProseMirror ? iconToProseMirror(type) : icon;
}
