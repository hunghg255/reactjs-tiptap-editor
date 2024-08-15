import type { DefaultTheme, HeadConfig, LocaleConfig } from 'vitepress';
import { createTranslate } from './i18n/utils';

const docsLink = 'https://reactjs-tiptap-editor.vercel.app';
const githubRepo = 'hunghg255/reactjs-tiptap-editor';
const githubLink: 'https://github.com/hunghg255/reactjs-tiptap-editor' = `https://github.com/${githubRepo}`;

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
      link: `${urlPrefix}/extensions/align/text-align.md`,
      activeMatch: 'extensions',
    },
    {
      text: t('Playground'),
      link: `https://reactjs-tiptap-editor-playground.vercel.app/`,
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
          text: t('Internationalization'),
          link: `${urlPrefix}/guide/internationalization`,
        },
      ],
    },
    {
      text: t('Extensions'),
      items: [
        {
          text: t('Alignment'),
          link: '/extensions/align/text-align.md',
        },
        {
          text: t('Clear'),
          collapsed: false,
          items: [
            { text: 'Clear Format', link: '/extensions/clear/clear-format.md' },
            { text: 'Format Painter', link: '/extensions/clear/format-painter.md' },
          ],
        },
        {
          text: t('Text'),
          collapsed: false,
          items: [
            { text: 'Font Family', link: '/extensions/text/font-family.md' },
            { text: 'Heading', link: '/extensions/text/heading.md' },
            { text: 'Font Size', link: '/extensions/text/font-size.md' },
            { text: 'Bold', link: '/extensions/text/font-bold.md' },
            { text: 'Italic', link: '/extensions/text/font-italic.md' },
            { text: 'Font Underline', link: '/extensions/text/font-underline.md' },
            { text: 'Font Strike', link: '/extensions/text/font-strike.md' },
            { text: 'Subscript', link: '/extensions/text/subscript.md' },
          ],
        },
        {
          text: t('Code'),
          collapsed: false,
          items: [
            { text: 'Code', link: '/extensions/code/code.md' },
            { text: 'Code Block', link: '/extensions/code/code-block.md' },
          ],
        },
        {
          text: t('Color'),
          collapsed: false,
          items: [
            { text: 'Text Color', link: '/extensions/color/text-color.md' },
            { text: 'Background Color', link: '/extensions/color/background-color.md' },
          ],
        },
        {
          text: t('Divider'),
          link: '/extensions/divider/index.md',
        },

        {
          text: t('History'),
          link: '/extensions/history/index.md',
        },
        {
          text: t('Link'),
          link: '/extensions/link/index.md',
        },
        {
          text: t('List'),
          collapsed: false,
          items: [
            { text: 'Bullet List', link: '/extensions/list/bullet-list.md' },
            { text: 'Ordered List', link: '/extensions/list/ordered-list.md' },
            { text: 'Task List', link: '/extensions/list/task-list.md' },
          ],
        },
        {
          text: t('Media'),
          collapsed: false,
          items: [
            { text: 'Image', link: '/extensions/media/image.md' },
            { text: 'Video', link: '/extensions/media/video.md' },
          ],
        },
        {
          text: t('Table'),
          link: '/extensions/table/index.md',
        },
        {
          text: t('Column'),
          link: '/extensions/column/multiple-column.md',
        },
        {
          text: t('Iframe'),
          link: '/extensions/iframe/index.md',
        },
      ],
    },
  ];

  const themeConfig: DefaultTheme.Config = {
    logo: '/logo.png',
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: githubLink }],
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
