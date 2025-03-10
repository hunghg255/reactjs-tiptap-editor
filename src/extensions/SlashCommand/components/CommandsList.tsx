import React, {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { IconComponent } from '@/components';
import { cn } from '@/lib/utils';
import { useLocale } from '@/locales';

function CommandsList(props: any, ref: any) {
  // 选中的索引
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  // 滚动ref
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const { t } = useLocale();

  const activeItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useImperativeHandle(ref, () => {
    return {
      onKeyDown,
    };
  });

  useEffect(() => {
    if (!scrollContainer.current) {
      return;
    }
    const activeItemIndex = selectedGroupIndex * 1000 + selectedCommandIndex;
    const activeItem = activeItemRefs.current[activeItemIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedCommandIndex, selectedGroupIndex]);

  function onKeyDown({ event }: any) {
    if (event.key === 'ArrowUp') {
      upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      enterHandler();
      return true;
    }

    return false;
  }

  function upHandler() {
    if (props.items.length === 0) {
      return false;
    }
    let newCommandIndex = selectedCommandIndex - 1;
    let newGroupIndex = selectedGroupIndex;

    if (newCommandIndex < 0) {
      newGroupIndex = selectedGroupIndex - 1;
      newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0;
    }

    if (newGroupIndex < 0) {
      newGroupIndex = props.items.length - 1;
      newCommandIndex = props.items[newGroupIndex].commands.length - 1;
    }

    setSelectedCommandIndex(newCommandIndex);
    setSelectedGroupIndex(newGroupIndex);
  }

  function downHandler() {
    if (props.items.length === 0) {
      return false;
    }
    const commands = props.items[selectedGroupIndex].commands;
    let newCommandIndex = selectedCommandIndex + 1;
    let newGroupIndex = selectedGroupIndex;

    if (commands.length - 1 < newCommandIndex) {
      newCommandIndex = 0;
      newGroupIndex = selectedGroupIndex + 1;
    }
    if (props.items.length - 1 < newGroupIndex) {
      newGroupIndex = 0;
    }
    setSelectedCommandIndex(newCommandIndex);
    setSelectedGroupIndex(newGroupIndex);
  }

  function enterHandler() {
    if (props.items.length === 0 || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
      return false;
    }

    selectItem(selectedGroupIndex, selectedCommandIndex);
  }

  function selectItem(groupIndex: number, commandIndex: number) {
    const command = props.items[groupIndex].commands[commandIndex];
    props.command(command);
  }

  function createCommandClickHandler(groupIndex: number, commandIndex: number) {
    selectItem(groupIndex, commandIndex);
  }
  function setActiveItemRef(groupIndex: number, commandIndex: number, el: any) {
    activeItemRefs.current[groupIndex * 1000 + commandIndex] = el;
  }

  return (
    <div
      className="richtext-mb-8 richtext-max-h-[min(80vh,24rem)] richtext-flex-wrap richtext-overflow-auto richtext-rounded-lg !richtext-border !richtext-border-neutral-200 !richtext-bg-white richtext-p-1 !richtext-text-black richtext-shadow-sm dark:!richtext-border-neutral-800 dark:!richtext-bg-black"
      ref={scrollContainer}
    >
      {props?.items?.length
        ? (
          <div className="richtext-grid richtext-min-w-48 richtext-grid-cols-1 richtext-gap-0.5">
            {props?.items?.map((group: any, groupIndex: any) => {
              return (
                <Fragment key={`slash-${group.title}`}>
                  <div className="richtext-col-[1/-1] richtext-mx-2 richtext-mt-2 richtext-select-none richtext-text-[0.65rem] richtext-font-semibold richtext-uppercase richtext-tracking-wider !richtext-text-neutral-500 first:richtext-mt-0.5">
                    {group.title}
                  </div>

                  {group.commands.map((command: any, commandIndex: any) => {
                    return (
                      <button
                        key={`command-${commandIndex}`}
                        onClick={() => createCommandClickHandler(groupIndex, commandIndex)}
                        ref={el => setActiveItemRef(groupIndex, commandIndex, el)}
                        className={cn('richtext-flex richtext-items-center richtext-gap-3 richtext-px-2 richtext-py-1.5 richtext-text-sm !richtext-text-neutral-800 dark:!richtext-text-neutral-200 richtext-text-left richtext-w-full richtext-rounded-sm richtext-outline-none richtext-transition-colors !richtext-bg-transparent hover:!richtext-bg-accent ', {
                          'slash-command-active': selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex,
                        })}
                      >
                        {command.iconUrl && <img alt=""
                          className="richtext-size-6"
                          src={command.iconUrl}
                        />}

                        {command.iconName && (
                          <IconComponent className="!richtext-mr-1 !richtext-text-lg"
                            name={command.iconName}
                          />
                        )}

                        {command.label}
                      </button>
                    );
                  })}
                </Fragment>
              );
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
  );
}

export default forwardRef(CommandsList);
