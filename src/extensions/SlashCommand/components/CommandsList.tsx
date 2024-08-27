/* eslint-disable react/no-duplicate-key */
/* eslint-disable react-dom/no-missing-button-type */
import React, {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { IconComponent } from '@/components'
import { useLocale } from '@/locales'
import { cn } from '@/lib/utils'

function CommandsList(props: any, ref: any) {
  // 选中的索引
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  // 滚动ref
  const scrollContainer = useRef<HTMLDivElement | null>(null)

  const { t } = useLocale()

  const activeItemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useImperativeHandle(ref, () => {
    return {
      onKeyDown,
    }
  })

  useEffect(() => {
    if (!scrollContainer.current) {
      return
    }
    const activeItemIndex = selectedGroupIndex * 1000 + selectedCommandIndex
    const activeItem = activeItemRefs.current[activeItemIndex]
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedCommandIndex, selectedGroupIndex])

  function onKeyDown({ event }: any) {
    if (event.key === 'ArrowUp') {
      upHandler()
      return true
    }

    if (event.key === 'ArrowDown') {
      downHandler()
      return true
    }

    if (event.key === 'Enter') {
      enterHandler()
      return true
    }

    return false
  }

  function upHandler() {
    if (props.items.length === 0) {
      return false
    }
    let newCommandIndex = selectedCommandIndex - 1
    let newGroupIndex = selectedGroupIndex

    if (newCommandIndex < 0) {
      newGroupIndex = selectedGroupIndex - 1
      newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
    }

    if (newGroupIndex < 0) {
      newGroupIndex = props.items.length - 1
      newCommandIndex = props.items[newGroupIndex].commands.length - 1
    }

    setSelectedCommandIndex(newCommandIndex)
    setSelectedGroupIndex(newGroupIndex)
  }

  function downHandler() {
    if (props.items.length === 0) {
      return false
    }
    const commands = props.items[selectedGroupIndex].commands
    let newCommandIndex = selectedCommandIndex + 1
    let newGroupIndex = selectedGroupIndex

    if (commands.length - 1 < newCommandIndex) {
      newCommandIndex = 0
      newGroupIndex = selectedGroupIndex + 1
    }
    if (props.items.length - 1 < newGroupIndex) {
      newGroupIndex = 0
    }
    setSelectedCommandIndex(newCommandIndex)
    setSelectedGroupIndex(newGroupIndex)
  }

  function enterHandler() {
    if (props.items.length === 0 || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
      return false
    }

    selectItem(selectedGroupIndex, selectedCommandIndex)
  }

  function selectItem(groupIndex: number, commandIndex: number) {
    const command = props.items[groupIndex].commands[commandIndex]
    props.command(command)
  }

  function createCommandClickHandler(groupIndex: number, commandIndex: number) {
    selectItem(groupIndex, commandIndex)
  }
  function setActiveItemRef(groupIndex: number, commandIndex: number, el: any) {
    activeItemRefs.current[groupIndex * 1000 + commandIndex] = el
  }

  return (
    <div
      className="!richtext-bg-white richtext-rounded-lg dark:!richtext-bg-black richtext-shadow-sm !richtext-border !richtext-border-neutral-200 dark:!richtext-border-neutral-800 !richtext-text-black richtext-max-h-[min(80vh,24rem)] richtext-overflow-auto richtext-flex-wrap richtext-mb-8 richtext-p-1"
      ref={scrollContainer}
    >
      {props?.items?.length
        ? (
            <div className="richtext-grid richtext-grid-cols-1 richtext-gap-0.5 richtext-min-w-48">
              {props?.items?.map((group: any, groupIndex: any) => {
                return (
                  <Fragment key={`slash-${group.title}`}>
                    <div className="!richtext-text-neutral-500 richtext-text-[0.65rem] richtext-col-[1/-1] richtext-mx-2 richtext-mt-2 richtext-font-semibold richtext-tracking-wider richtext-select-none richtext-uppercase first:richtext-mt-0.5">
                      {group.title}
                    </div>

                    {group.commands.map((command: any, commandIndex: any) => {
                      return (
                        <button
                          className={cn(`richtext-flex richtext-items-center richtext-gap-3 richtext-px-2 richtext-py-1.5 richtext-text-sm !richtext-text-neutral-800 dark:!richtext-text-neutral-200 richtext-text-left richtext-w-full richtext-rounded-sm richtext-outline-none richtext-transition-colors !richtext-bg-transparent hover:!richtext-bg-accent `, {
                            'slash-command-active': selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex,
                          })}
                          ref={el => setActiveItemRef(groupIndex, commandIndex, el)}
                          key={`command-${commandIndex}`}
                          onClick={() => createCommandClickHandler(groupIndex, commandIndex)}
                        >
                          {command.iconUrl && <img className="richtext-w-6 richtext-h-6" src={command.iconUrl} alt="" />}
                          {command.iconName && (
                            <IconComponent name={command.iconName} className="!richtext-mr-1 !richtext-text-lg" />
                          )}
                          {command.label}
                        </button>
                      )
                    })}
                  </Fragment>
                )
              })}
            </div>
          )
        : (
            <div className="richtext-p-3">
              <span className="richtext-text-xs richtext-text-gray-800 dark:richtext-text-gray-100">
                {t('editor.slash.empty')}
              </span>
            </div>
          )}
    </div>
  )
}

export default forwardRef(CommandsList)
