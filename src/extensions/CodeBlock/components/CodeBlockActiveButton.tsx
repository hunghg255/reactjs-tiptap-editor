/* eslint-disable react/no-duplicate-key */
import React, { useMemo } from 'react'

import type { BundledLanguage } from 'shiki'
import {
  ActionButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    <Select>
      <SelectTrigger disabled={props?.disabled} asChild>
        <ActionButton
          tooltip={props?.tooltip}
          disabled={props?.disabled}
          icon={props?.icon}
        />
      </SelectTrigger>
      <SelectContent className="richtext-w-full richtext-max-h-60 richtext-overflow-y-auto">
        {langs?.map((item: any) => {
          return (
            <SelectItem key={`codeblock-${item.title}`} onClick={() => onClick(item.language)}>
              <div className="richtext-h-full richtext-ml-1">
                {item.title}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export default CodeBlockActiveButton
