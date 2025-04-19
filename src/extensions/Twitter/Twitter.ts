import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import NodeViewTweet from '@/extensions/Twitter/components/NodeViewTweet';
import TwitterActiveButton from '@/extensions/Twitter/components/TwitterActiveButton';

const TWITTER_REGEX_GLOBAL = /(https?:\/\/)?(www\.)?x\.com\/(\w{1,15})(\/status\/(\d+))?(\/\S*)?/g;
const TWITTER_REGEX = /^https?:\/\/(www\.)?x\.com\/(\w{1,15})(\/status\/(\d+))?(\/\S*)?$/;

function isValidTwitterUrl(url: string) {
  return url.match(TWITTER_REGEX);
}

interface TwitterOptions {
  /**
   * Controls if the paste handler for tweets should be added.
   * @default true
   * @example false
   */
  addPasteHandler: boolean

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  HTMLAttributes: Record<string, any>

  /**
   * Controls if the twitter node should be inline or not.
   * @default false
   * @example true
   */
  inline: boolean

  /**
   * The origin of the tweet.
   * @default ''
   * @example 'https://tiptap.dev'
   */
  origin: string
}

/**
 * The options for setting a tweet.
 */
interface SetTweetOptions {
  src: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    twitter: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setTweet: (options: SetTweetOptions) => ReturnType
      updateTweet: (options: SetTweetOptions) => ReturnType
    }
  }
}

/**
 * This extension adds support for tweets.
 */
export const Twitter = /* @__PURE__ */ Node.create<TwitterOptions>({
  name: 'twitter',
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      addPasteHandler: true,
      HTMLAttributes: {},
      inline: false,
      origin: '',
      button: ({ editor, t }: any) => ({
        component: TwitterActiveButton,
        componentProps: {
          action: (src: string) => {
            editor.commands.setTweet({ src });
          },
          isActive: () => false,
          disabled: false,
          icon: 'Twitter',
          tooltip: t('editor.twitter.tooltip'),
          editor,
        },
      }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeViewTweet, { attrs: this.options.HTMLAttributes });
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-twitter]',
      },
    ];
  },

  addCommands() {
    return {
      setTweet:
        (options: SetTweetOptions) =>
          ({ commands }) => {
            if (!isValidTwitterUrl(options.src)) {
              return false;
            }

            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
      updateTweet: (options: SetTweetOptions) => ({ commands }: any) => {
        if (!isValidTwitterUrl(options.src)) {
          return false;
        }

        return commands.updateAttributes(this.name, { src: options.src });
      },
    };
  },

  addPasteRules() {
    if (!this.options.addPasteHandler) {
      return [];
    }

    return [
      nodePasteRule({
        find: TWITTER_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => {
          return { src: match.input };
        },
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-twitter': '' }, HTMLAttributes)];
  },
});
