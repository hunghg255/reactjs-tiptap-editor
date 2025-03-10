/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NodeViewWrapper, type ReactNodeViewRendererOptions } from '@tiptap/react';
import { Tweet } from 'react-tweet';

export const TWITTER_REGEX_GLOBAL = /(https?:\/\/)?(www\.)?x\.com\/(\w{1,15})(\/status\/(\d+))?(\/\S*)?/g;
export const TWITTER_REGEX = /^https?:\/\/(www\.)?x\.com\/(\w{1,15})(\/status\/(\d+))?(\/\S*)?$/;

export function isValidTwitterUrl(url: string) {
  return url.match(TWITTER_REGEX);
}

function NodeViewTweet({ node }: { node: Partial<ReactNodeViewRendererOptions> }) {
  // @ts-expect-error
  const url = node?.attrs?.src || '';
  const tweetId = url?.split('/').pop();

  if (!tweetId) {
    return null;
  }

  return (
    <NodeViewWrapper>
      <div data-twitter="">
        <Tweet id={tweetId} />
      </div>
    </NodeViewWrapper>
  );
}

export default NodeViewTweet;
