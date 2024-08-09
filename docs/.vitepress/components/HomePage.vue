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
]);
</script>

<template>
  <br />
  <br />
  <div flex="~ col wrap" mt8 items-center>
    <VPTeamMembers size="small" :members="members" />
  </div>
</template>
