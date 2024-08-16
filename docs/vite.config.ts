import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import changeLog from '../scripts/changeLog.json'
import contributions from '../scripts/contributions.json'
import { ChangeLog } from './.vitepress/plugins/changelog'
import { Contributors } from './.vitepress/plugins/contributors'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

export default defineConfig(async () => {
  return {
    plugins: [MarkdownTransform(), ChangeLog(changeLog), Contributors(contributions), VueJsx(), Unocss()],
    optimizeDeps: {
      include: [
        '@nolebase/vitepress-plugin-enhanced-readabilities > @nolebase/ui > @rive-app/canvas',
      ],
      exclude: ['@nolebase/vitepress-plugin-enhanced-readabilities/client', 'vitepress'],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
      ],
    },
  }
})
