import { useCallback, useState } from 'react'

import RichTextEditor, {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Emoji,
  Excalidraw,
  ExportPdf,
  ExportWord,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImageUpload,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TableOfContents,
  TaskList,
  TextAlign,
  Underline,
  Video,
  VideoUpload,
  locale,
} from 'reactjs-tiptap-editor'

import 'reactjs-tiptap-editor/style.css'

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Katex,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Image,
  ImageUpload.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 500)
      })
    },
  }),
  Video,
  VideoUpload.configure({
    upload: (files: File[]) => {
      const f = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))
      return Promise.resolve(f)
    },
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock.configure({ defaultTheme: 'dracula' }),
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({ spacer: true }),
  ImportWord.configure({
    upload: (files: File[]) => {
      const f = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))
      return Promise.resolve(f)
    },
  }),
  ExportWord,
  Excalidraw,
]

const DEFAULT = `<h1 style="text-align: center">Rich Text Editor</h1><p>A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> for Reactjs</p><div class="excalidraw" defaultshowpicker="false" width="800" height="199" data="{&quot;elements&quot;:[{&quot;type&quot;:&quot;rectangle&quot;,&quot;version&quot;:15,&quot;versionNonce&quot;:1501503441,&quot;isDeleted&quot;:false,&quot;id&quot;:&quot;pjx5DYxD23xDHXQ85nOSw&quot;,&quot;fillStyle&quot;:&quot;cross-hatch&quot;,&quot;strokeWidth&quot;:2,&quot;strokeStyle&quot;:&quot;solid&quot;,&quot;roughness&quot;:1,&quot;opacity&quot;:100,&quot;angle&quot;:0,&quot;x&quot;:289.74224853515625,&quot;y&quot;:183.94967651367188,&quot;strokeColor&quot;:&quot;#e03131&quot;,&quot;backgroundColor&quot;:&quot;#ffc9c9&quot;,&quot;width&quot;:334.83209228515625,&quot;height&quot;:176.76864624023438,&quot;seed&quot;:1327620497,&quot;groupIds&quot;:[],&quot;frameId&quot;:null,&quot;roundness&quot;:{&quot;type&quot;:3},&quot;boundElements&quot;:[],&quot;updated&quot;:1725207092250,&quot;link&quot;:null,&quot;locked&quot;:false},{&quot;type&quot;:&quot;ellipse&quot;,&quot;version&quot;:18,&quot;versionNonce&quot;:1802132881,&quot;isDeleted&quot;:false,&quot;id&quot;:&quot;pHn8celdAeDKdhKVI6hCR&quot;,&quot;fillStyle&quot;:&quot;cross-hatch&quot;,&quot;strokeWidth&quot;:2,&quot;strokeStyle&quot;:&quot;solid&quot;,&quot;roughness&quot;:1,&quot;opacity&quot;:100,&quot;angle&quot;:0,&quot;x&quot;:706.022216796875,&quot;y&quot;:146.41253662109375,&quot;strokeColor&quot;:&quot;#e03131&quot;,&quot;backgroundColor&quot;:&quot;#ffc9c9&quot;,&quot;width&quot;:200.49169921875,&quot;height&quot;:213.36334228515625,&quot;seed&quot;:487390641,&quot;groupIds&quot;:[],&quot;frameId&quot;:null,&quot;roundness&quot;:{&quot;type&quot;:2},&quot;boundElements&quot;:[],&quot;updated&quot;:1725207094676,&quot;link&quot;:null,&quot;locked&quot;:false},{&quot;id&quot;:&quot;il96EMYE5vxuyhlTjVGCI&quot;,&quot;type&quot;:&quot;diamond&quot;,&quot;x&quot;:573.7800827026367,&quot;y&quot;:355.6528778076172,&quot;width&quot;:198.252685546875,&quot;height&quot;:149.70916748046875,&quot;angle&quot;:0,&quot;strokeColor&quot;:&quot;#1e1e1e&quot;,&quot;backgroundColor&quot;:&quot;transparent&quot;,&quot;fillStyle&quot;:&quot;solid&quot;,&quot;strokeWidth&quot;:2,&quot;strokeStyle&quot;:&quot;solid&quot;,&quot;roughness&quot;:1,&quot;opacity&quot;:100,&quot;groupIds&quot;:[],&quot;frameId&quot;:null,&quot;roundness&quot;:{&quot;type&quot;:2},&quot;seed&quot;:434826577,&quot;version&quot;:24,&quot;versionNonce&quot;:190824561,&quot;isDeleted&quot;:false,&quot;boundElements&quot;:null,&quot;updated&quot;:1725207125935,&quot;link&quot;:null,&quot;locked&quot;:false}],&quot;appState&quot;:{&quot;isLoading&quot;:false},&quot;files&quot;:{}}"></div><p style="text-align: center"></p><p style="text-align: center"><img height="auto" src="https://picsum.photos/1920/1080.webp?t=1" width="500"></p><p></p><div data-type="horizontalRule"><hr></div><h2>Demo</h2><p>👉<a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://reactjs-tiptap-editor.vercel.app/">Demo</a></p><h2>Features</h2><ul><li><p>Use <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> components</p></li><li><p>Markdown support</p></li><li><p>TypeScript support</p></li><li><p>I18n support</p></li><li><p>React support</p></li><li><p>Slash Commands</p></li><li><p>Multi Column</p></li><li><p>TailwindCss</p></li><li><p>Support emoji</p></li><li><p>Support iframe</p></li></ul><h2>Installation</h2><pre><code class="language-bash">pnpm add reactjs-tiptap-editor</code></pre><p></p>`

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function App() {
  const [content, setContent] = useState(DEFAULT)
  const [theme, setTheme] = useState('light')
  const [disable, setDisable] = useState(false)

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value)
    }, 300),
    [],
  )
  return (
    <div
      className="p-[24px] flex flex-col w-full max-w-screen-lg gap-[24px] mx-[auto] my-0"
      style={{
        maxWidth: 1024,
        margin: '40px auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '100px',
          marginBottom: 10,
        }}
      >
        <button onClick={() => locale.setLang('vi')}>Vietnamese</button>
        <button onClick={() => locale.setLang('en')}>English</button>
        <button onClick={() => locale.setLang('zh_CN')}>Chinese</button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button onClick={() => setDisable(!disable)}>{disable ? 'Editable' : 'Readonly'}</button>
      </div>

      <RichTextEditor
        output="html"
        content={content as any}
        onChangeContent={onValueChange}
        extensions={extensions}
        dark={theme === 'dark'}
        disabled={disable}
      />

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
