import type { Editor as CoreEditor, Extension, JSONContent } from '@tiptap/core'
import type { Editor } from '@tiptap/react'

export type { Editor, JSONContent } from '@tiptap/core'

/**
 * Represents the onChange event for EchoEditor.
 */
export interface EchoEditorOnChange {
  /** Editor object */
  editor: CoreEditor
  /** Output content, can be a string or JSON content */
  output: string | JSONContent
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

/**
 * Represents the general options for Tiptap extensions.
 */
export interface GeneralOptions<T> {
  /** Enabled divider */
  divider: boolean
  /** Enabled spacer */
  spacer: boolean
  /** Button view function */
  button: ButtonView<T>
  /** Show on Toolbar */
  toolbar?: boolean
}

/**
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps {
  /** Method triggered when action is performed */
  action?: (value?: any) => void
  /** Whether it is in the active state */
  isActive?: () => boolean
  /** Button icon */
  icon?: any
  /** Text displayed on hover */
  tooltip?: string
  [x: string]: any
}

/**
 * Represents the slots for the ButtonView component.
 */
export interface ButtonViewReturnComponentSlots {
  /** Dialog slot */
  dialog: () => any
  [x: string]: () => any
}

/**
 * Represents the return value for the ButtonView component.
 */
export interface ButtonViewReturn {
  /** Component */
  component: unknown
  /** Component props */
  componentProps: ButtonViewReturnComponentProps
  /** Component slots */
  componentSlots?: ButtonViewReturnComponentSlots
}

/**
 * Represents the parameters for the ButtonView function.
 */
export interface ButtonViewParams<T = any> {
  /** Editor object */
  editor: Editor
  /** Extension object */
  extension: Extension<T>
  /** Translation function */
  t: (path: string) => string
}

/**
 * Represents the ButtonView function.
 */
export interface ButtonView<T = any> {
  (options: ButtonViewParams<T>): ButtonViewReturn | ButtonViewReturn[]
}

/**
 * Represents the BubbleMenuRenderProps.
 */
export interface BubbleMenuRenderProps {
  editor: Editor
  disabled: boolean
  bubbleMenu: BubbleMenuProps
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
    hidden?: boolean
  }
  tableConfig?: {
    /**
     * @description Table menu hidden
     * @default false
     */
    hidden?: boolean
  }
  floatingMenuConfig?: {
    /**
     * @description Floating menu hidden
     * @default false
     */
    hidden?: boolean
  }
  linkConfig?: {
    /**
     * @description Link menu hidden
     * @default false
     */
    hidden?: boolean
  }
  textConfig?: {
    /**
     * @description Text menu hidden
     * @default false
     */
    hidden?: boolean
  }
  imageConfig?: {
    /**
     * @description Image menu hidden
     * @default false
     */
    hidden?: boolean
  }
  imageGifConfig?: {
    /**
     * @description Image menu hidden
     * @default false
     */
    hidden?: boolean
  }
  videoConfig?: {
    /**
     * @description Video menu hidden
     * @default false
     */
    hidden?: boolean
  }
  katexConfig?: {
    /**
     * @description katex menu hidden
     * @default false
     */
    hidden?: boolean
  }
  excalidrawConfig?: {
    /**
     * @description excalidraw menu hidden
     * @default false
     */
    hidden?: boolean
  }
  iframeConfig?: {
    /**
     * @description iframe menu hidden
     * @default false
     */
    hidden?: boolean
  }
  mermaidConfig?: {
    /**
     * @description mermaid menu hidden
     * @default false
     */
    hidden?: boolean
  }
  twitterConfig?: {
    /**
     * @description twitter menu hidden
     * @default false
     */
    hidden?: boolean
  }
  render?: (props: BubbleMenuRenderProps, dom: React.ReactNode) => React.ReactNode
}

/**
 * Represents the ToolbarItemProps.
 */
export interface ToolbarItemProps {
  button: {
    component: React.ComponentType<any>
    componentProps: Record<string, any>
  }
  divider: boolean
  spacer: boolean
  type: string
  name: string
}

export interface ToolbarRenderProps {
  editor: Editor
  disabled: boolean
}
export interface ToolbarProps {
  render?: (props: ToolbarRenderProps, toolbarItems: ToolbarItemProps[], dom: JSX.Element[], containerDom: (innerContent: React.ReactNode) => React.ReactNode) => React.ReactNode
}

export interface NameValueOption<T = string> {
  name: string
  value: T
}
