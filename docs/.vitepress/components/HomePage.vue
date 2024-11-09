<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme';
import { computed } from 'vue';
import { useTranslate } from '../i18n/composable';

const t = useTranslate();

const members = computed(() => [
  {
    avatar: 'https://github.com/hunghg255.png',
    name: 'hunghg255',
    title: t('Author'),
    links: [{ icon: 'github', link: 'https://github.com/hunghg255' }],
  },
  {
    avatar: 'https://github.com/condorheroblog.png',
    name: 'Condor Hero',
    title: t('Contributor'),
    links: [{ icon: 'github', link: 'https://github.com/condorheroblog' }],
  },
]);
</script>

<template>
  <br />
  <br />
  <div flex="~ col wrap" mt8 items-center>
    <VPTeamMembers size="small" :members="members" />
  </div>

  <h4 class="text-center mt-[50px] mb-[10px] font-bold">Thanks to the following friends for their contributions to project</h4>
  <div class="flex items-center justify-center">
    <img class="max-w-[300px]" src="/contributor-circles.svg" alt="logo" />
  </div>
</template>
