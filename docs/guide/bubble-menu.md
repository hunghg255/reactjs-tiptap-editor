---
description: Bubble Menu

next:
  text: Internationalization
  link: /guide/internationalization.md
---

# Bubble Menu

The bubble menu, as its name suggests, is a context menu that appears when you select content for editing. It provides quick access to editing operations, such as `Bold`, `Italic`, and `Code`, among others.

## Usage

The bubble menu will be automatically enabled when you import the correct plugins.

The system provides the following default bubble menus:

| Component Name  | Functionality                                                                                | Configuration Field |
|:---------------:|----------------------------------------------------------------------------------------------|---------------------|
| BubbleMenuText  | Provides text-related editing operations like bold, italic, underline, etc.                  | textConfig          |
| BubbleMenuLink  | Provides link-related operations like add, edit, delete links                                | linkConfig          |
| BubbleMenuImage | Provides image-related operations like resizing, alignment, etc.                             | imageConfig         |
| BubbleMenuVideo | Provides video-related operations like playback control, size adjustment, etc.               | videoConfig         |
| TableBubbleMenu | Provides table-related operations like adding/deleting rows and columns, merging cells, etc. | tableConfig         |
|   BubbleMenuIframe     | Provides iframe-related  operations like size, link , etc.  | iframeConfig          |
|   ColumnsMenu   | Provides multi-column layout operations like adjusting column numbers, widths, etc.          | columnConfig        |
|   ContentMenu   | Provides general content-related operations like copy, paste, delete, etc.                   | floatingMenuConfig  |
|   BubbleMenuImageGif   | Provides general content-related operations like copy, paste, delete, image gif etc.                   | imageGifConfig  |

## Disabling the Bubble Menu

If you don't want to use the bubble menu, you can disable it using the `hideBubble` property.

```jsx
<RichTextEditor
  {...otherProps}
  hideBubble={true}
/>
```

## Disabling a Specific Bubble Menu

If you want to disable a specific bubble menu, you can do so using the `bubbleMenu` property. For example, to disable the text-related menu:

```jsx
<RichTextEditor
  {...otherProps}
  bubbleMenu={{
    textConfig: {
      hidden: true,
    }
  }}
/>
```

## Customizing the Bubble Menu

If you want to customize the bubble menu, you can configure it using the `render` function within the `bubbleMenu` property.

```jsx
<RichTextEditor
  {...otherProps}
  bubbleMenu={{
    render: (props, menuDom) => {
      return <YourComponent />
    },
  }}
/>
```
