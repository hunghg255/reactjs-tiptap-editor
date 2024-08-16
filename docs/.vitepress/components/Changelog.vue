<script setup lang="ts">
import changelog from '/virtual-changelog';
import { computed } from 'vue';
import { renderCommitMessage } from '../theme/utils';
import extensions from '../../../scripts/extensions.json';

const props = defineProps<{ fn: string }>();
const info = computed(() => extensions.find((i) => i.name === props.fn)) as any;

const allCommits = changelog as any[];

const names = computed(() => [props.fn, ...(info.value?.alias || [])]);

const commits = computed(() => {
  const related = allCommits.filter(
    (c) => c.version || c.functions?.some((i: any) => names.value.includes(i)),
  );

  return  related.filter((i, idx) => {
    if (i.version && (!related[idx + 1] || related[idx + 1]?.version)) return false;
    return true;
  });
});
</script>

<template>
  <em v-if="!commits.length" opacity="70">No recent changes</em>

  <div v-if="commits.length" class="grid grid-cols-[30px_auto] gap-1.5 children:my-auto changeLog">
    <template v-for="(commit, idx) of commits" :key="commit.hash">
      <template v-if="idx === 0 && !commit.version">
        <div m="t-1" />
        <div m="t-1" />
        <div class="m-auto inline-flex bg-gray-400/10 w-7 h-7 rounded-full text-sm opacity-90">
          <octicon-git-pull-request-draft-16 m="auto" />
        </div>
        <div>
          <code>Pending for release...</code>
        </div>
      </template>
      <template v-if="commit.version">
        <div m="t-1" />
        <div m="t-1" />
        <div
          class="m-auto inline-flex justify-center items-center bg-gray-400/10 w-7 h-7 rounded-full text-sm opacity-90"
        >
          <svg
            viewBox="0 0 16 16"
            width="1.2em"
            height="1.2em"
            m="auto"
            style="display: inline-block"
          >
            <path
              fill="currentColor"
              d="M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.75 8.75 0 0 1-2.564 6.186l-.458.459q-.472.471-.979.904v3.207c0 .608-.315 1.172-.833 1.49l-2.774 1.707a.75.75 0 0 1-1.11-.418l-.954-3.102a1 1 0 0 1-.145-.125L3.754 9.816a1 1 0 0 1-.124-.145L.528 8.717a.75.75 0 0 1-.418-1.11l1.71-2.774A1.75 1.75 0 0 1 3.31 4h3.204q.433-.508.904-.979l.459-.458A8.75 8.75 0 0 1 14.064 0M8.938 3.623h-.002l-.458.458c-.76.76-1.437 1.598-2.02 2.5l-1.5 2.317l2.143 2.143l2.317-1.5c.902-.583 1.74-1.26 2.499-2.02l.459-.458a7.25 7.25 0 0 0 2.123-5.127V1.75a.25.25 0 0 0-.25-.25h-.186a7.25 7.25 0 0 0-5.125 2.123M3.56 14.56c-.732.732-2.334 1.045-3.005 1.148a.23.23 0 0 1-.201-.064a.23.23 0 0 1-.064-.201c.103-.671.416-2.273 1.15-3.003a1.502 1.502 0 1 1 2.12 2.12m6.94-3.935q-.132.09-.266.175l-2.35 1.521l.548 1.783l1.949-1.2a.25.25 0 0 0 .119-.213ZM3.678 8.116L5.2 5.766q.087-.135.176-.266H3.309a.25.25 0 0 0-.213.119l-1.2 1.95ZM12 5a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
            ></path>
          </svg>
        </div>
        <div>
          <a
            :href="`https://github.com/hunghg255/reactjs-tiptap-editor/releases/tag/${commit.version}`"
            target="_blank"
          >
            <code class="!text-primary font-bold">{{ commit.version }}</code>
          </a>
          <span class="opacity-50 text-xs">
            on {{ new Date(commit.date).toLocaleDateString() }}</span
          >
        </div>
      </template>
      <template v-else>
        <svg
          viewBox="0 0 16 16"
          width="1.2em"
          height="1.2em"
          class="m-auto transform rotate-90 opacity-30"
          style="display: inline-block"
        >
          <path
            fill="currentColor"
            d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0"
          ></path>
        </svg>
        <div>
          <a
            :href="`https://github.com/hunghg255/reactjs-tiptap-editor/commit/${commit.hash}`"
            target="_blank"
          >
            <code class="!text-xs !text-$vp-c-text-2 !hover:text-primary">{{
              commit.hash.slice(0, 5)
            }}</code>
          </a>
          <span text="sm">
            -
            <span v-html="renderCommitMessage(commit.message.replace(`(${fn})`, ''))" />
          </span>
        </div>
      </template>
    </template>
  </div>
</template>
