import type { DefaultTheme, HeadConfig, LocaleConfig } from 'vitepress';

import { createTranslate } from './i18n/utils';
import { version } from '../../package.json';

const docsLink = 'https://reactjs-tiptap-editor.vercel.app';
const githubRepo = 'hunghg255/reactjs-tiptap-editor';
const githubLink: 'https://github.com/hunghg255/reactjs-tiptap-editor' = `https://github.com/${githubRepo}`;

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: 'Release Notes', link: 'https://github.com/hunghg255/reactjs-tiptap-editor/releases' },
  { text: 'Contributing', link: 'https://github.com/hunghg255/reactjs-tiptap-editor/blob/main/CONTRIBUTING.md' },
];

export function getLocaleConfig(lang: string) {
  const t = createTranslate(lang);

  const urlPrefix = lang && lang !== 'en' ? `/${lang}` : '';
  const title = t('React Tiptap Editor');
  const description = t(
    'A modern WYSIWYG rich text editor based on tiptap and shadcn ui for React',
  );

  const head: HeadConfig[] = [
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: docsLink }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    ['meta', { name: 'theme-color', content: '#914796' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ];

  const nav: DefaultTheme.NavItem[] = [
    {
      text: t('Guide'),
      link: `${urlPrefix}/guide/getting-started`,
      activeMatch: 'guide',
    },
    {
      text: t('Extensions'),
      link: `${urlPrefix}/extensions/BaseKit/index.md`,
      activeMatch: 'extensions',
    },
    {
      text: t('Playground'),
      link: 'https://reactjs-tiptap-editor-playground.vercel.app/',
    },
    {
      text: `v${version}`,
      items: VERSIONS,
    },
  ];

  const sidebar: DefaultTheme.SidebarItem[] = [
    {
      text: t('Guide'),
      items: [
        {
          text: t('Getting Started'),
          link: `${urlPrefix}/guide/getting-started`,
        },
        {
          text: t('Toolbar'),
          link: `${urlPrefix}/guide/toolbar`,
        },
        {
          text: t('Bubble Menu'),
          link: `${urlPrefix}/guide/bubble-menu`,
        },
        {
          text: t('Customize'),
          link: `${urlPrefix}/guide/customize.md`,
        },
        {
          text: t('Internationalization'),
          link: `${urlPrefix}/guide/internationalization`,
        },
      ],
    },
    {
      text: t('Extensions'),
      items: [

        {
          text: 'BaseKit',
          link: '/extensions/BaseKit/index.md',
        },
        {
          text: 'Blockquote',
          link: '/extensions/Blockquote/index.md',
        },
        {
          text: 'Bold',
          link: '/extensions/Bold/index.md',
        },
        {
          text: 'BulletList',
          link: '/extensions/BulletList/index.md',
        },
        {
          text: 'Clear',
          link: '/extensions/Clear/index.md',
        },
        {
          text: 'Code',
          link: '/extensions/Code/index.md',
        },
        {
          text: 'CodeBlock',
          link: '/extensions/CodeBlock/index.md',
        },
        {
          text: 'Color',
          link: '/extensions/Color/index.md',
        },
        {
          text: 'Document',
          link: '/extensions/Document/index.md',
        },
        {
          text: 'FontFamily',
          link: '/extensions/FontFamily/index.md',
        },
        {
          text: 'FontSize',
          link: '/extensions/FontSize/index.md',
        },
        {
          text: 'FormatPainter',
          link: '/extensions/FormatPainter/index.md',
        },
        {
          text: 'Heading',
          link: '/extensions/Heading/index.md',
        },
        {
          text: 'Highlight',
          link: '/extensions/Highlight/index.md',
        },
        {
          text: 'History',
          link: '/extensions/History/index.md',
        },
        {
          text: 'HorizontalRule',
          link: '/extensions/HorizontalRule/index.md',
        },
        {
          text: 'Iframe',
          link: '/extensions/Iframe/index.md',
        },
        {
          text: 'Image',
          link: '/extensions/Image/index.md',
        },
        {
          text: 'Indent',
          link: '/extensions/Indent/index.md',
        },
        {
          text: 'Italic',
          link: '/extensions/Italic/index.md',
        },
        {
          text: 'LineHeight',
          link: '/extensions/LineHeight/index.md',
        },
        {
          text: 'Link',
          link: '/extensions/Link/index.md',
        },
        {
          text: 'ListItem',
          link: '/extensions/ListItem/index.md',
        },
        {
          text: 'MoreMark',
          link: '/extensions/MoreMark/index.md',
        },
        {
          text: 'MultiColumn',
          link: '/extensions/MultiColumn/index.md',
        },
        {
          text: 'OrderedList',
          link: '/extensions/OrderedList/index.md',
        },
        {
          text: 'Selection',
          link: '/extensions/Selection/index.md',
        },
        {
          text: 'SlashCommand',
          link: '/extensions/SlashCommand/index.md',
        },
        {
          text: 'Strike',
          link: '/extensions/Strike/index.md',
        },
        {
          text: 'SubAndSuperScript',
          link: '/extensions/SubAndSuperScript/index.md',
        },
        {
          text: 'Table',
          link: '/extensions/Table/index.md',
        },
        {
          text: 'TaskList',
          link: '/extensions/TaskList/index.md',
        },
        {
          text: 'TextAlign',
          link: '/extensions/TextAlign/index.md',
        },
        {
          text: 'TextBubble',
          link: '/extensions/TextBubble/index.md',
        },
        {
          text: 'TrailingNode',
          link: '/extensions/TrailingNode/index.md',
        },
        {
          text: 'TextUnderline',
          link: '/extensions/TextUnderline/index.md',
        },
        {
          text: 'Video',
          link: '/extensions/Video/index.md',
        },
        {
          text: 'Search And Replace',
          link: '/extensions/SearchAndReplace/index.md',
        },
        {
          text: 'Emoji',
          link: '/extensions/Emoji/index.md',
        },
        {
          text: 'Katex',
          link: '/extensions/Katex/index.md',
        },
        {
          text: 'ExportPdf',
          link: '/extensions/ExportPdf/index.md',
        },
        {
          text: 'ImportWord',
          link: '/extensions/ImportWord/index.md',
        },
        {
          text: 'ExportWord',
          link: '/extensions/ExportWord/index.md',
        },
        {
          text: 'TableOfContents',
          link: '/extensions/TableOfContents/index.md',
        },
        {
          text: 'Excalidraw',
          link: '/extensions/Excalidraw/index.md',
        },
        {
          text: 'TextDirection',
          link: '/extensions/TextDirection/index.md',
        },
        {
          text: 'Mention',
          link: '/extensions/Mention/index.md',
        },
        {
          text: 'Attachment',
          link: '/extensions/Attachment/index.md',
        },
        {
          text: 'ImageGif',
          link: '/extensions/ImageGif/index.md',
        },
        {
          text: 'Mermaid',
          link: '/extensions/Mermaid/index.md',
        },
        {
          text: 'Twitter',
          link: '/extensions/Twitter/index.md',
        },
        {
          text: 'Drawer',
          link: '/extensions/Drawer/index.md',
        },
      ],
    },
  ];

  const themeConfig: DefaultTheme.Config = {
    logo: '/logo.png',
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: githubLink },
      { icon: 'npm', link: 'https://www.npmjs.com/package/reactjs-tiptap-editor' },
    ],
    footer: {
      message: t('Made with ❤️'),
      copyright: 'MIT License © 2024-PRESENT <a href="https://github.com/hunghg255">hunghg255</a>',
    },
    editLink: {
      pattern: `${githubLink}/edit/main/docs/:path`,
      text: t('Edit this page on GitHub'),
    },
  };

  const localeConfig: LocaleConfig<DefaultTheme.Config>[string] = {
    label: t('English'),
    lang: t('en'),
    title,
    description,
    head,
    themeConfig,
  };

  return localeConfig;
}
