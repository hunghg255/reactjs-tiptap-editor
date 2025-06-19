import { Node } from '@tiptap/core';

import { VIDEO_SIZE } from '@/constants';
import ActionVideoButton from '@/extensions/Video/components/ActiveVideoButton';
import type { GeneralOptions,VideoAlignment } from '@/types';
import { getCssUnitWithDefault } from '@/utils/utils';

/**
 * Represents the interface for video options, extending GeneralOptions.
 */
export interface VideoOptions extends GeneralOptions<VideoOptions> {
  /**
   * Indicates whether fullscreen play is allowed
   *
   * @default true
   */
  allowFullscreen: boolean
  /**
   * Indicates whether to display the frameborder
   *
   * @default false
   */
  frameborder: boolean
  /**
   * Width of the video, can be a number or string
   *
   * @default VIDEO_SIZE['size-medium']
   */
  width: number | string
  /** HTML attributes object for passing additional attributes */
  HTMLAttributes: {
    [key: string]: any
  }
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>

  /** The source URL of the video */
  resourceVideo: 'upload' | 'link' | 'both',

  /**
   * List of allowed video hosting providers
   * Use ['.'] to allow any URL, or specify providers like ['youtube', 'vimeo']
   *
   * @default ['.']
   */
  videoProviders?: string[]
}

/**
 * Represents the type for setting video options
 */
interface SetVideoOptions {
  /** The source URL of the video */
  src: string
  /** The width of the video */
  width: string | number

  align: VideoAlignment;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Add an video
       */
      setVideo: (options: Partial<SetVideoOptions>) => ReturnType
      /**
       * Update an video
       */
      updateVideo: (options: Partial<SetVideoOptions>) => ReturnType
    }
  }
}

function linkConvert(src: string) {
  // Convert Youtube links
  src = src
    .replace('https://youtu.be/', 'https://www.youtube.com/watch?v=')
    .replace('watch?v=', 'embed/');

  // Convert YouTube Shorts
  // eslint-disable-next-line unicorn/better-regex
  const youtubeShortsMatch = src.match(/^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (youtubeShortsMatch) {
    const videoId = youtubeShortsMatch[1];
    src = `https://www.youtube.com/embed/${videoId}`;
  }

  // Convert vimeo links
  // eslint-disable-next-line unicorn/better-regex
  const vimeoMatch = src.match(/^https:\/\/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const hash = vimeoMatch[2];

    if (hash) {
      src = `https://player.vimeo.com/video/${videoId}?h=${hash}`;
    } else {
      src = `https://player.vimeo.com/video/${videoId}`;
    }
  }

  // Convert bilibili links
  const isBilibiliLink = /^https?:\/\/www.bilibili.com\/video\/.*/i.test(src);
  if (isBilibiliLink) {
    src = src
      .replace(/\?.*$/, '')
      .replace('https://www.bilibili.com/video/', 'https://player.bilibili.com/player.html?bvid=');
  }

  // Convert google drive links
  if (src.includes('drive.google.com')) {
    src = src.replace('/view', '/preview');
  }

  return src;
}

export const Video = /* @__PURE__ */ Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      divider: false,
      spacer: false,
      allowFullscreen: true,
      upload: undefined,
      frameborder: false,
      resourceVideo: 'both',
      width: VIDEO_SIZE['size-medium'],
      HTMLAttributes: {
        class: 'iframe-wrapper',
        // style: 'display: flex;justify-content: center;',
      },
      button: ({ editor, t }: any) => {
        return {
          component: ActionVideoButton,
          componentProps: {
            action: () => {
              return;
            },
            isActive: () => editor.isActive('video') || false,
            /* If setVideo is not available(when Video Component is not imported), the button is disabled */
            disabled: !editor.can().setVideo?.({}),
            icon: 'Video',
            tooltip: t('editor.video.tooltip'),
            videoProviders: ['.'],
            editor,
          },
        };
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        renderHTML: ({ src }) => ({
          src: src ? linkConvert(src) : null,
        }),
      },
      width: {
        default: this.options.width,
        renderHTML: ({ width }) => ({
          width: getCssUnitWithDefault(width),
        }),
      },
      frameborder: {
        default: this.options.frameborder ? 1 : 0,
        parseHTML: () => (this.options.frameborder ? 1 : 0),
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      align: {
        default: 'center', // Default alignment
        renderHTML: ({ align }) => ({
          align: align,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video] iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width = '100%' ,align = 'center' } = HTMLAttributes ?? {};

    const iframeHTMLAttributes = {
      ...HTMLAttributes,
      width: '100%',
      height: '100%',
    };

    const responsiveStyle = `position: relative;overflow: hidden;display: flex;flex: 1;max-width: ${width};`;
    const responsiveSizesStyle = `flex: 1;padding-bottom: ${(9 / 16) * 100}%;`;
    const positionStyle = `display: flex; justify-content: ${align};`;

    const iframeDOM = ['iframe', iframeHTMLAttributes];
    const sizesDOM = ['div', { style: responsiveSizesStyle }];
    const responsiveDOM = [
      'div',
      { style: responsiveStyle },
      sizesDOM,
      iframeDOM,
    ];
    const positionDiv = ['div', { style: positionStyle }, responsiveDOM];

    const divAttrs = {
      ...this.options.HTMLAttributes,
      class: 'iframe-wrapper',
      'data-video': '',
    };

    return ['div', divAttrs, positionDiv];
  },

  addCommands() {
    return {
      setVideo:
        options =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
      updateVideo:
        options =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, options);
          },
    };
  },

});
