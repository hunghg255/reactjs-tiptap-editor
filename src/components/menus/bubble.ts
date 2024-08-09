import { deleteSelection } from '@tiptap/pm/commands';
import type { Editor } from '@tiptap/react';

import { IMAGE_SIZE, VIDEO_SIZE } from '@/constants';
import type { ButtonViewParams, ButtonViewReturn, ExtensionNameKeys } from '@/types';
import { localeActions } from '@/locales';
import ActionButton from '@/components/ActionButton';
import { Bold, Code, Color, Highlight, Italic, Link, Strike, Underline } from '@/extensions';

/** Represents the size types for bubble images or videos */
type BubbleImageOrVideoSizeType = 'size-small' | 'size-medium' | 'size-large';
type ImageAlignments = 'left' | 'center' | 'right';

/** Represents the various types for bubble images */
type BubbleImageType =
  | `image-${BubbleImageOrVideoSizeType}`
  | `video-${BubbleImageOrVideoSizeType}`
  | 'image'
  | 'image-aspect-ratio'
  | 'remove';

/** Represents the types for bubble videos */
type BubbleVideoType = 'video' | 'remove';

/** Represents the overall types for bubbles */
type BubbleAllType =
  | BubbleImageType
  | BubbleVideoType
  | ExtensionNameKeys
  | 'divider'
  | (string & {});

/** Represents the key types for node types */
export type NodeTypeKey = 'image' | 'text' | 'video';

/** Represents the menu of bubble types for each node type */
export type BubbleTypeMenu = Partial<Record<NodeTypeKey, BubbleMenuItem[]>>;

/** Represents the menu of overall bubble types for each node type */
export type NodeTypeMenu = Partial<Record<NodeTypeKey, BubbleAllType[]>>;

/**
 * Represents the structure of a bubble menu item.
 */
export interface BubbleMenuItem extends ButtonViewReturn {
  /** The type of the bubble item */
  type: BubbleAllType;
}

/**
 * Represents a function to generate a bubble menu
 */
interface BubbleView<T = any> {
  /**
   * Generates a bubble menu based on the provided options.
   * @param {ButtonViewParams<T>} options - The options for generating the bubble menu.
   * @returns {BubbleTypeMenu} The generated bubble menu.
   */
  (options: ButtonViewParams<T>): BubbleTypeMenu;
}

/**
 * Represents the options for configuring bubbles.
 * @interface BubbleOptions
 * @template T
 */
export interface BubbleOptions<T> {
  /** The menu of bubble types for each node type. */
  list: NodeTypeMenu;
  /** The default list of bubble types. */
  defaultBubbleList: any;
  /** The function to generate a bubble menu. */
  button: BubbleView<T>;
}

const imageSizeMenus = (editor: Editor): BubbleMenuItem[] => {
  const types: BubbleImageOrVideoSizeType[] = ['size-small', 'size-medium', 'size-large'];
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = [
    'SizeS',
    'SizeM',
    'SizeL',
  ];

  return types.map((size, i) => ({
    type: `image-${size}`,
    component: ActionButton,
    componentProps: {
      tooltip: localeActions.t(`editor.${size.replace('-', '.')}.tooltip`),
      icon: icons[i],
      action: () => editor.commands.updateImage({ width: IMAGE_SIZE[size] }),
      isActive: () => editor.isActive('image', { width: IMAGE_SIZE[size] }),
    },
  }));
};

const imageAlignMenus = (editor: Editor): BubbleMenuItem[] => {
  const types: ImageAlignments[] = ['left', 'center', 'right'];
  const iconMap: any = {
    left: 'AlignLeft',
    center: 'AlignCenter',
    right: 'AlignRight',
  };
  return types.map((k, i) => ({
    type: `image-${k}`,
    component: ActionButton,
    componentProps: {
      tooltip: localeActions.t(`editor.textalign.${k}.tooltip`),
      icon: iconMap[k],
      action: () => editor.commands.setTextAlign(k),
      isActive: () => editor.isActive({ textAlign: k }) || false,
      disabled: !editor.can().setTextAlign(k),
    },
  }));
};

const videoSizeMenus = (editor: Editor): BubbleMenuItem[] => {
  const types: BubbleImageOrVideoSizeType[] = ['size-small', 'size-medium', 'size-large'];
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = [
    'SizeS',
    'SizeM',
    'SizeL',
  ];

  return types.map((size, i) => ({
    type: `video-${size}`,
    component: ActionButton,
    componentProps: {
      tooltip: localeActions.t(`editor.${size.replace('-', '.')}.tooltip`),
      icon: icons[i],
      action: () => editor.commands.updateVideo({ width: VIDEO_SIZE[size] }),
      isActive: () => editor.isActive('video', { width: VIDEO_SIZE[size] }),
    },
  }));
};
export const getBubbleImage = (editor: Editor): BubbleMenuItem[] => [
  ...imageSizeMenus(editor),
  ...imageAlignMenus(editor),
  {
    type: 'remove',
    component: ActionButton,
    componentProps: {
      editor,
      tooltip: localeActions.t('editor.remove'),
      icon: 'Trash2',
      action: () => {
        const { state, dispatch } = editor.view;
        deleteSelection(state, dispatch);
      },
    },
  },
];

export const getBubbleVideo = (editor: Editor): BubbleMenuItem[] => [
  ...videoSizeMenus(editor),
  {
    type: 'remove',
    component: ActionButton,
    componentProps: {
      editor,
      tooltip: localeActions.t('editor.remove'),
      icon: 'Trash2',
      action: () => {
        const { state, dispatch } = editor.view;
        deleteSelection(state, dispatch);
      },
    },
  },
];

export const getBubbleText = (editor: Editor, t: any) => [
  Bold.configure().options.button({ editor, t }),
  Italic.configure().options.button({ editor, t }),
  Underline.configure().options.button({ editor, t }),
  Strike.configure().options.button({ editor, t }),
  Code.configure().options.button({ editor, t }),
  Link.configure().options.button({ editor, t }),
  {
    type: 'divider',
    component: undefined,
    componentProps: {},
  },
  Color.configure().options.button({ editor, t }),
  Highlight.configure().options.button({ editor, t }),
];
