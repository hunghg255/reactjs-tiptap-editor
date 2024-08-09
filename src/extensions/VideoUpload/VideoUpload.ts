/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable indent */
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import ActionButton from '@/components/ActionButton';
import VideoUploaderView from '@/extensions/VideoUpload/components/VideoUploaderView';

export interface VideoOptions {
  upload?: (files: File[]) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoUpload: {
      setVideoUpload: () => ReturnType;
    };
  }
}

export const VideoUpload = Node.create<VideoOptions>({
  name: 'videoUpload',
  isolating: true,
  defining: true,
  group: 'block',
  draggable: true,
  selectable: true,
  inline: false,
  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },
  renderHTML() {
    return ['div', { 'data-type': this.name }];
  },

  addCommands() {
    return {
      setVideoUpload:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoUploaderView);
  },
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      button: ({ editor, t }: any) => {
        return {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.setVideoUpload(),
            isActive: () => editor.isActive('video') || false,
            disabled: !editor.can().setVideo({}),
            icon: 'Video',
            tooltip: t('editor.video.tooltip'),
          },
        };
      },
    };
  },
});

export default VideoUpload;
