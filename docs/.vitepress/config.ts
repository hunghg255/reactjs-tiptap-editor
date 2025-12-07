import { defineConfig } from 'vitepress';
import { defaultHoverInfoProcessor, transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { transformerRemoveNotationEscape, transformerNotationDiff } from '@shikijs/transformers';
import { getLocaleConfig } from './locale';
import { transformHead } from './transformHead';

const docsLink = 'https://reactjs-tiptap-editor.vercel.app';

export default defineConfig({
  lang: 'en-US',
  ignoreDeadLinks: true,
  locales: {
    root: getLocaleConfig('en'),
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-CN': {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
  },
  sitemap: {
    hostname: docsLink,
  },
  transformHead,
  // markdown: {
  //   codeTransformers: [
  //     {
  //       // Render custom themes with codeblocks
  //       name: 'shiki:inline-theme',
  //       preprocess(code, options) {
  //         const reg = /\btheme:([\w,-]+)\b/;
  //         const match = options.meta?.__raw?.match(reg);
  //         if (!match?.[1]) return;
  //         const theme = match[1];
  //         const themes = theme.split(',').map((i) => i.trim());
  //         if (!themes.length) return;
  //         if (themes.length === 1) {
  //           // @ts-expect-error anyway
  //           delete options.themes;
  //           // @ts-expect-error anyway
  //           options.theme = themes[0];
  //         } else if (themes.length === 2) {
  //           // @ts-expect-error anyway
  //           delete options.theme;
  //           // @ts-expect-error anyway
  //           options.themes = {
  //             light: themes[0],
  //             dark: themes[1],
  //           };
  //         } else {
  //           throw new Error(`Only 1 or 2 themes are supported, got ${themes.length}`);
  //         }
  //         return code;
  //       },
  //     },
  //     {
  //       name: 'shiki:inline-decorations',
  //       preprocess(code, options) {
  //         const reg = /^\/\/ @decorations:(.*)\n/;
  //         code = code.replace(reg, (match, decorations) => {
  //           options.decorations ||= [];
  //           options.decorations.push(...JSON.parse(decorations));
  //           return '';
  //         });
  //         return code;
  //       },
  //     },
  //     transformerTwoslash({
  //       // errorRendering: 'hover',
  //       processHoverInfo(info) {
  //         return (
  //           defaultHoverInfoProcessor(info)
  //             // Remove shiki_core namespace
  //             .replace(/_shikijs_core\w*\./g, '')
  //         );
  //       },
  //     }),
  //     transformerRemoveNotationEscape(),
  //     transformerNotationDiff(),
  //   ],
  // },
});
