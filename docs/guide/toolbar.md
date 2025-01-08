---
description: Toolbar

next:
  text: Bubble Menu
  link: /guide/bubble-menu.md
---

# Toolbar

The toolbar of the rich text editor.

## Usage

Hide a certain toolbar:

```js
Bold.configure({
  toolbar: false,
})
```

## Customizing the Toolbar

```jsx
<RichTextEditor
  toolbar={{
    render: (props, toolbarItems, dom, containerDom) => {
      return containerDom(dom)
    }
  }}
/>
```

## ToolbarProps

```ts
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
```
