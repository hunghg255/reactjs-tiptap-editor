import { PluginKey } from '@tiptap/pm/state';

import type { Range } from '@tiptap/core';

export interface AISession extends Range {
  prompt?: string;
}
export const aiPluginKey = new PluginKey<AISession | null>('richtextAI');
