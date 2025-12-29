import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { RichTextProvider } from 'reactjs-tiptap-editor'

import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale-bundle'

import { themeActions, useTheme } from 'reactjs-tiptap-editor/theme'


// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// build extensions
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import { SearchAndReplace, RichTextSearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { TextUnderline, RichTextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist';
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { LineHeight, RichTextLineHeight } from 'reactjs-tiptap-editor/lineheight';
import { TaskList, RichTextTaskList } from 'reactjs-tiptap-editor/tasklist';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import { Video, RichTextVideo } from 'reactjs-tiptap-editor/video';
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';
import { Blockquote, RichTextBlockquote } from 'reactjs-tiptap-editor/blockquote';
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { Column, ColumnNode, MultipleColumnNode, RichTextColumn } from 'reactjs-tiptap-editor/column';
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table';
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { ImportWord, RichTextImportWord } from 'reactjs-tiptap-editor/importword';
import { ExportWord, RichTextExportWord} from 'reactjs-tiptap-editor/exportword';
import { TextDirection, RichTextTextDirection } from 'reactjs-tiptap-editor/textdirection';
import { Attachment, RichTextAttachment } from 'reactjs-tiptap-editor/attachment';
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import { Excalidraw, RichTextExcalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { Twitter, RichTextTwitter } from 'reactjs-tiptap-editor/twitter';
import { Mention } from 'reactjs-tiptap-editor/mention';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';

// Slash Command
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';


// Bubble
import {
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleImage,
  RichTextBubbleVideo,
  RichTextBubbleImageGif,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleMenuDragHandle
} from 'reactjs-tiptap-editor/bubble';

import 'reactjs-tiptap-editor/style.css'
import 'prism-code-editor-lightweight/layout.css';
import "prism-code-editor-lightweight/themes/github-dark.css"
import 'katex/dist/katex.min.css'
import 'easydrawer/styles.css'
import "@excalidraw/excalidraw/index.css";

import 'katex/contrib/mhchem'

// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCaret from '@tiptap/extension-collaboration-caret'
// import { HocuspocusProvider } from '@hocuspocus/provider'
// import * as Y from 'yjs'
import { EditorContent, useEditor } from '@tiptap/react';

// const ydoc = new Y.Doc()

// const hocuspocusProvider = new HocuspocusProvider({
//   url: 'ws://0.0.0.0:8080',
//   name: 'github.com/hunghg255',
//   document: ydoc,
// })

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
});

const MOCK_USERS = [{
    id: '0',
    label: 'hunghg255',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/42096908?v=4'
    }
  },
 {
  id: '1',
    label: 'benjamincanac',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  },
  {
    id: '2',
    label: 'atinux',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/904724?v=4'
    }
  },
  {
    id: '3',
    label: 'danielroe',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/28706372?v=4'
    }
  },
  {
    id: '4',
    label: 'pi0',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/5158436?v=4'
    }
  }
];

const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  })
]

const extensions = [
 ...BaseKit,

  History,
  SearchAndReplace,
  Clear,
  FontFamily,
  Heading,
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color,
  Highlight,
  BulletList,
  OrderedList,
  TextAlign,
  Indent,
  LineHeight,
  TaskList,
  Link,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 300)
      })
    },
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 300)
      })
    },
  }),
    ImageGif.configure({
    provider: 'giphy',
    API_KEY: import.meta.env.VITE_GIPHY_API_KEY as string
  }),
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,

  Column,
  ColumnNode,
  MultipleColumnNode,
  Table,
  Iframe,
  ExportPdf,
  ImportWord,
  ExportWord,
  TextDirection,
  Attachment.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Drawer.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Twitter,
  Mention.configure({
    suggestion: {
      char: '@',
      items: async ({ query }: any) => {
        console.log('query', query);
        // const data = MOCK_USERS.map(item => item.label);
        // return data.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));
        return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
      },
    }
    // suggestions: [
    //   {
    //     char: '@',
    //     items: async ({ query }: any) => {
    //       return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
    //     },
    //   },
    //   {
    //     char: '#',
    //     items: async ({ query }: any) => {
    //       return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
    //     },
    //   }
    // ]
  }),
  SlashCommand,
  CodeView,

  //  Collaboration.configure({
  //   document: hocuspocusProvider.document,
  // }),
  // CollaborationCaret.configure({
  //   provider: hocuspocusProvider,
  //   user: {
  //     color: getRandomColor(),
  //   },
  // }),
]

const DEFAULT = ``

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const Header = ({ editor, theme, setTheme }) => {
  const [editorEditable, setEditorEditable] = useState(false);
  const currentLocale = useLocale();
  const currentTheme = useTheme();

  useEffect(() => {
    setEditorEditable(editor?.isEditable ?? true);
  }, []);

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        setEditorEditable(editor.isEditable);
      })
    }

    return () => {
      if (editor) {
        editor.off('update', () => {
          setEditorEditable(editor.isEditable);
        })
      }
    }
  }, [editor]);

  return <>
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginTop: '100px',
        marginBottom: 10,
      }}
    >
      {currentLocale.lang}
      {currentTheme.color}
      <button type="button" onClick={() => {
        localeActions.setLang('vi')
      }}>Vietnamese</button>
      <button type="button" onClick={() => localeActions.setLang('en')}>English</button>
      <button type="button" onClick={() => localeActions.setLang('zh_CN')}>Chinese</button>
      <button type="button" onClick={() => localeActions.setLang('pt_BR')}>Português</button>
      <button type="button" onClick={() => localeActions.setLang('hu_HU')}>Hungarian</button>
      <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
      <button type="button" onClick={() => {
        editor?.setEditable(!editorEditable);
      }}>{editorEditable ? 'Editable' : 'Disabled'}</button>


    </div>
      <div className='flex items-center gap-1'>
        <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setTheme('light');
        }}>Theme light</button>
         <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setTheme('dark');
        }} >Theme dark</button>
      </div>

      <div className='flex items-center gap-1'>
        <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('default');
        }} >Color default</button>
         <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('red');
        }} >Theme red</button>

        <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('blue');
        }} >Theme blue</button>

        <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('green');
        }} >Theme green</button>

        <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('orange');
        }} >Theme orange</button>

          <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('rose');
        }} >Theme rose</button>

         <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('violet');
        }} >Theme violet</button>

         <button className="border border-solid border-gray-500 p-1" onClick={() => {
          themeActions.setColor('yellow');
        }} >Theme yellow</button>
      </div>

      <div className='flex items-center gap-2'>
        <span>Border radius</span>

        <input type='range' min={0} max={3} step={0.05} defaultValue={0.65} onChange={(e) => {
          const value = e.target.value;
          themeActions.setBorderRadius(`${value}rem`);
        }} />
      </div>
  </>
}

const RichTextToolbar = () => {

  return <div className="flex items-center gap-2 flex-wrap border-b border-solid">
    <RichTextUndo />
    <RichTextRedo />
    <RichTextSearchAndReplace />
    <RichTextClear />
    <RichTextFontFamily />
    <RichTextHeading />
    <RichTextFontSize />
    <RichTextBold />
    <RichTextItalic />
    <RichTextUnderline />
    <RichTextStrike />
    <RichTextMoreMark />
    <RichTextEmoji />
    <RichTextColor />
    <RichTextHighlight />
    <RichTextBulletList />
    <RichTextOrderedList />
    <RichTextAlign />
    <RichTextIndent />
    <RichTextLineHeight />
    <RichTextTaskList />
    <RichTextLink />
    <RichTextImage />
    <RichTextVideo />
    <RichTextImageGif />
    <RichTextBlockquote />
    <RichTextHorizontalRule />
    <RichTextCode />
    <RichTextCodeBlock />
    <RichTextColumn />
    <RichTextTable />
    <RichTextIframe />
    <RichTextExportPdf />
    <RichTextImportWord />
    <RichTextExportWord />
    <RichTextTextDirection />
    <RichTextAttachment />
    <RichTextKatex />
    <RichTextExcalidraw />
    <RichTextMermaid />
    <RichTextDrawer />
    <RichTextTwitter />
    <RichTextCodeView />
  </div>
}

function App() {
  const [content, setContent] = useState(DEFAULT)
  const [theme, setTheme] = useState('light')

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value)
    }, 300),
    [],
  )

  const editor = useEditor({
    // shouldRerenderOnTransaction:  false,
    textDirection: 'auto', // global text direction
    content,
    extensions,
    // content,
    // immediatelyRender: false, // error duplicate plugin key
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onValueChange(html)
    },
  });

  useEffect(() => {
    window['editor'] = editor;
  }, [editor]);

  return (
    <div
      className="p-[24px] flex flex-col w-full max-w-screen-lg gap-[24px] mx-[auto] my-0"
      style={{
        maxWidth: 1024,
        margin: '40px auto',
        }}
      >
        <Header editor={editor} setTheme={setTheme} theme={theme}/>

      <RichTextProvider editor={editor}
      dark={theme === 'dark'}
      >
        <div className="overflow-hidden rounded-[0.5rem] bg-background shadow outline outline-1">
          <div className="flex max-h-full w-full flex-col">
            <RichTextToolbar />

            <EditorContent
              editor={editor}
            />

            {/* Bubble */}
            <RichTextBubbleColumns />
            <RichTextBubbleDrawer />
            <RichTextBubbleExcalidraw />
            <RichTextBubbleIframe />
            <RichTextBubbleKatex />
            <RichTextBubbleLink />

            <RichTextBubbleImage />
            <RichTextBubbleVideo />
            <RichTextBubbleImageGif />

            <RichTextBubbleMermaid />
            <RichTextBubbleTable />
            <RichTextBubbleText />
            <RichTextBubbleTwitter />

            <RichTextBubbleMenuDragHandle />

            {/* Command List */}
            <SlashCommandList />

          </div>
        </div>
      </RichTextProvider>

      {typeof content === 'string' && (
        <textarea
          style={{
            marginTop: 20,
            height: 500,
          }}
          readOnly
          value={content}
        />
      )}
    </div>
  )
}

export default App
