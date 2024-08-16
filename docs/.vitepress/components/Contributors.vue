<script setup lang="ts">
import _contributors from '/virtual-contributors'
import { computed } from 'vue'

import { generateGithubAvatar, generateGithubLink, generateUserName } from '../theme/utils';

const props = defineProps<{ fn: string }>()

function uniqueObjects(arr, prop) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[prop];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}

const contributors = computed(() => {
  const allContributors = _contributors[props.fn] || [] as any[];

  return uniqueObjects(allContributors, 'name');
})
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <em v-if="!contributors.length" opacity="70">No recent changes</em>

    <div v-for="c of contributors" :key="c.hash" class="flex gap-2 items-center">
      <a :href="generateGithubLink(c.name)" target="_blank" rel="noopener noreferrer" class="flex gap-2 items-center">
        <img :src="generateGithubAvatar(c.name, c.hash)" class="w-8 h-8 rounded-full">
        {{ generateUserName(c.name) }}
      </a>
    </div>
  </div>
</template>
