import { type ActionButtonProps } from './components';

import type { Editor as CoreEditor, Extension, JSONContent } from '@tiptap/core';
import type { Editor } from '@tiptap/react';

export type { Editor, JSONContent } from '@tiptap/core';

/**
 * Represents the onChange event for EchoEditor.
 */
export interface EchoEditorOnChange {
  /** Editor object */
  editor: CoreEditor;
  /** Output content, can be a string or JSON content */
  output: string | JSONContent;
}

/**
 * Represents the keys for different extensions.
 */
export type ExtensionNameKeys =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'color'
  | 'highlight'
  | 'painter'
  | 'heading'
  | 'textAlign'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'indent'
  | 'link'
  | 'image'
  | 'video'
  | 'table'
  | 'blockquote'
  | 'horizontalRule'
  | 'code'
  | 'codeBlock'
  | 'clear'
  | 'history'
  | 'twitter'
  | 'katex'
  | 'excalidraw'
  | 'mermaid'
  | 'drawer'
  | 'shortMessage';

/**
 * Represents the general options for Tiptap extensions.
 */
export interface GeneralOptions<T, P = ButtonViewReturnComponentProps> {
  /** Enabled divider */
  divider: boolean;
  /** Enabled spacer */
  spacer: boolean;
  /** Button view function */
  button: ButtonView<T, P>;
  /** Show on Toolbar */
  toolbar?: boolean;
  /** Shortcut keys override */
  shortcutKeys?: string[] | string[][];
}

/**
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps<TValue = unknown> {
  /** Method triggered when action is performed */
  action?: (value?: TValue) => void;
  /** Whether it is in the active state */
  isActive?: () => boolean;
  /** Button icon */
  icon?: string;
  /** Text displayed on hover */
  tooltip?: string;
  disabled?: boolean;
  shortcutKeys?: string[];
  tooltipOptions?: import('@radix-ui/react-tooltip').TooltipContentProps;
  color?: string;
  target?: string;
  undo?: ButtonViewReturnComponentProps;
  redo?: ButtonViewReturnComponentProps;
  indent?: ButtonViewReturnComponentProps;
  outdent?: ButtonViewReturnComponentProps;
  [x: string]: unknown;
}

/**
 * Represents the slots for the ButtonView component.
 */
export interface ButtonViewReturnComponentSlots {
  /** Dialog slot */
  dialog: () => React.ReactNode;
  [x: string]: () => React.ReactNode;
}

/**
 * Represents the return value for the ButtonView component.
 */
export interface ButtonViewReturn<P = ButtonViewReturnComponentProps> {
  /** Component */
  component?: React.ElementType<P>;
  /** Component props */
  componentProps: P;
  /** Component slots */
  componentSlots?: ButtonViewReturnComponentSlots;
}

/**
 * Represents the parameters for the ButtonView function.
 */
export interface ButtonViewParams<T = unknown> {
  /** Editor object */
  editor: Editor;
  /** Extension object */
  extension: Extension<T>;
  /** Translation function */
  t: (path: string) => string;
}

/**
 * Represents the ButtonView function.
 */
export type ButtonView<T = unknown, P = ButtonViewReturnComponentProps> = (
  options: ButtonViewParams<T>
) => ButtonViewReturn<P> | ButtonViewReturn<P>[];

/**
 * Represents the BubbleMenuRenderProps.
 */
export interface BubbleMenuRenderProps {
  editor: Editor;
  disabled: boolean;
  bubbleMenu: BubbleMenuProps;
  extensionsNames: string[];
}

export interface TableMenuConfig {
  /**
   * @description Column menu hidden
   * @default false
   */
  hidden?: boolean;

  /**
   * custom menu actions
   */
  actions?: ActionButtonProps[];

  /**
   * hidden default actions, if any
   */
  hiddenActions?: string[];
}

/**
 * Represents the BubbleMenuProps.
 */
export interface BubbleMenuProps {
  columnConfig?: {
    /**
     * @description Column menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  tableConfig?: TableMenuConfig;
  floatingMenuConfig?: {
    /**
     * @description Floating menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  linkConfig?: {
    /**
     * @description Link menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  textConfig?: {
    /**
     * @description Text menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  imageConfig?: {
    /**
     * @description Image menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  imageGifConfig?: {
    /**
     * @description Image menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  videoConfig?: {
    /**
     * @description Video menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  katexConfig?: {
    /**
     * @description katex menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  excalidrawConfig?: {
    /**
     * @description excalidraw menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  iframeConfig?: {
    /**
     * @description iframe menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  mermaidConfig?: {
    /**
     * @description mermaid menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  twitterConfig?: {
    /**
     * @description twitter menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  drawerConfig?: {
    /**
     * @description twitter menu hidden
     * @default false
     */
    hidden?: boolean;
  };
  render?: (props: BubbleMenuRenderProps, dom: React.ReactNode) => React.ReactNode;
}

/**
 * Represents the ToolbarItemProps.
 */
export interface ToolbarItemProps<P = ButtonViewReturnComponentProps> {
  button: {
    component: React.ComponentType<P>;
    componentProps: P;
  };
  divider: boolean;
  spacer: boolean;
  type: string;
  name: string;
}

export interface ToolbarRenderProps {
  editor: Editor;
  disabled: boolean;
}
export interface ToolbarProps {
  render?: (
    props: ToolbarRenderProps,
    toolbarItems: ToolbarItemProps[],
    dom: React.ReactNode[],
    containerDom: (innerContent: React.ReactNode) => React.ReactNode
  ) => React.ReactNode;
  tooltipSide?: 'top' | 'bottom';
}

export interface NameValueOption<T = string> {
  name: string;
  value: T;
}

export type VideoAlignment = 'flex-start' | 'center' | 'flex-end';

export type PaperSize = 'Legal' | 'Letter' | 'Tabloid' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5';

export type PageMargin =
  // Inches (in)
  | '0in'
  | '0.25in'
  | '0.4in'
  | '0.5in'
  | '0.75in'
  | '1in'
  | '1.25in'
  | '1.5in'
  | '1.75in'
  | '2in'
  // Centimeters (cm)
  | '0cm'
  | '0.5cm'
  | '1cm'
  | '1.5cm'
  | '2cm'
  | '2.5cm'
  | '3cm'
  | '4cm'
  | '5cm'
  // Millimeters (mm)
  | '0mm'
  | '5mm'
  | '10mm'
  | '15mm'
  | '20mm'
  | '25mm'
  | '30mm'
  | '40mm'
  | '50mm'
  // Points (pt)
  | '0pt'
  | '18pt'
  | '36pt'
  | '54pt'
  | '72pt'
  | '90pt'
  | '108pt'
  | '144pt';

/** Identifier assigned by RichTextProvider for editor-scoped events. */
declare module '@tiptap/core' {
  interface Editor {
    id?: string;
  }
}
