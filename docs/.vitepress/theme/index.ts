import type { EnhanceAppContext } from 'vitepress';
import Theme from 'vitepress/theme';

// import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import './style.css';
// import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
// import '@shikijs/vitepress-twoslash/style.css'
import Layout from './Layout.vue';
import Changelog from '../components/Changelog.vue';
import Contributors from '../components/Contributors.vue';

import 'uno.css';
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue';

export default {
  ...Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('Contributors', Contributors);
    app.component('Changelog', Changelog);
    app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons);

    // app.use(TwoslashFloatingVue)
  },
};
