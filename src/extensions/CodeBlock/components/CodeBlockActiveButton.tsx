import React, { useMemo } from 'react'

import type { BundledLanguage } from 'shiki'
import {
  ActionButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components'
import { MAP_LANGUAGE_CODE_LABELS } from '@/constants'

interface Props {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  languages?: BundledLanguage[]
  action: (language: string) => void
  icon?: any
}

function CodeBlockActiveButton({ action, languages, ...props }: Props) {
  const onClick = (language: string) => {
    action(language)
  }

  const langs = useMemo(() => {
    return languages?.map((language) => {
      const title = MAP_LANGUAGE_CODE_LABELS[language] || language

      return {
        title,
        // icon: language.icon,
        language,
      }
    })
  }, [languages])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={props?.disabled} asChild>
        <ActionButton
          tooltip={props?.tooltip}
          disabled={props?.disabled}
          icon={props?.icon}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="richtext-w-full !richtext-max-h-[180px] !richtext-overflow-y-scroll">
        {langs?.map((item: any) => {
          return (
            <DropdownMenuItem key={`codeblock-${item.title}`} onClick={() => onClick(item.language)}>
              <div className="richtext-h-full richtext-ml-1">
                {item.title}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CodeBlockActiveButton
