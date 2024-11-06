import { useState } from 'react'

import { ActionButton, IconComponent, Popover, PopoverContent, PopoverTrigger } from '@/components'
import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock'
import type { ButtonViewReturnComponentProps } from '@/types'

interface IPropsLinkEditPopover {
  editor: any
  icon?: any
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  isActive?: ButtonViewReturnComponentProps['isActive']
  action?: ButtonViewReturnComponentProps['action']
}

function LinkEditPopover(props: IPropsLinkEditPopover) {
  const [open, setOpen] = useState(false)

  function onSetLink(link: string, text?: string, openInNewTab?: boolean) {
    if (props.action) {
      props.action({ link, text, openInNewTab })
      setOpen(false)
    }
  }

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props?.disabled} asChild>
        <ActionButton
          tooltip={props?.tooltip}
          isActive={props?.isActive}
          disabled={props?.disabled}
        >
          <IconComponent name={props?.icon} />
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent hideWhenDetached className="richtext-w-full" align="start" side="bottom">
        <LinkEditBlock editor={props.editor} onSetLink={onSetLink} />
      </PopoverContent>
    </Popover>
  )
}

export default LinkEditPopover
