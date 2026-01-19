import BulitInMention, { type MentionOptions } from '@tiptap/extension-mention';
import { Extension } from '@tiptap/react';

import { NodeViewMentionList } from '@/extensions/Mention/components/NodeViewMentionList';
import { renderNodeViewClosure } from '@/utils/renderNodeView';

export const Mention = /* @__PURE__ */ Extension.create<MentionOptions>({
  name: 'richTextMentionWrapper',

  addExtensions() {
    const config: any = {
      ...this.options,
    };

    if (this.options?.suggestion) {
      config['suggestion'] = {
        render: renderNodeViewClosure(NodeViewMentionList),
        ...this.options.suggestion,
      };
    }

    if (this.options?.suggestions?.length) {
      config['suggestions'] = this.options.suggestions?.map((s) => {
        return {
          render: renderNodeViewClosure(NodeViewMentionList),
          ...s,
        };
      });
    }

    return [
      BulitInMention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        ...config,
      }),
    ];
  },
});
