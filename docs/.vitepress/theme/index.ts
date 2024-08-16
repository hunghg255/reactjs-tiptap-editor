import Theme from 'vitepress/theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import type { EnhanceAppContext } from 'vitepress'
import './style.css'
// import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import '@shikijs/vitepress-twoslash/style.css'
import Contributors from '../components/Contributors.vue'
import Changelog from '../components/Changelog.vue'
import Layout from './Layout.vue'
import 'uno.css'

export default {
  ...Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('Contributors', Contributors)
    app.component('Changelog', Changelog)

    app.use(TwoslashFloatingVue)
  },
}
