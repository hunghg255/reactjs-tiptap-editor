import React, {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { IconComponent, Label } from '@/components';
import { useFilterCommandList } from '@/extensions/SlashCommand/renderCommandListDefault';
import { cn } from '@/lib/utils';
import { useLocale } from '@/locales';
import { useSignalCommandList } from '@/store/commandList';

function SlashCommandNodeView(props: any, ref: any) {
  const [commandList] = useSignalCommandList();

  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const { t } = useLocale();

  const commandQuery = useFilterCommandList(commandList, props.query);

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
    if (commandQuery.length === 0) {
      return false;
    }
    let newCommandIndex = selectedCommandIndex - 1;
    let newGroupIndex = selectedGroupIndex;

    if (newCommandIndex < 0) {
      newGroupIndex = selectedGroupIndex - 1;
      newCommandIndex = commandQuery[newGroupIndex]?.commands.length - 1 || 0;
    }

    if (newGroupIndex < 0) {
      newGroupIndex = commandQuery.length - 1;
      newCommandIndex = commandQuery[newGroupIndex].commands.length - 1;
    }

    setSelectedCommandIndex(newCommandIndex);
    setSelectedGroupIndex(newGroupIndex);
  }

  function downHandler() {
    if (commandQuery.length === 0) {
      return false;
    }
    const commands = commandQuery[selectedGroupIndex].commands;
    let newCommandIndex = selectedCommandIndex + 1;
    let newGroupIndex = selectedGroupIndex;

    if (commands.length - 1 < newCommandIndex) {
      newCommandIndex = 0;
      newGroupIndex = selectedGroupIndex + 1;
    }
    if (commandQuery.length - 1 < newGroupIndex) {
      newGroupIndex = 0;
    }
    setSelectedCommandIndex(newCommandIndex);
    setSelectedGroupIndex(newGroupIndex);
  }

  function enterHandler() {
    if (commandQuery.length === 0 || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
      return false;
    }

    selectItem(selectedGroupIndex, selectedCommandIndex);
  }

  function selectItem(groupIndex: number, commandIndex: number) {
    const command = commandQuery[groupIndex].commands[commandIndex];
    props?.command(command);
  }

  function createCommandClickHandler(groupIndex: number, commandIndex: number) {
    selectItem(groupIndex, commandIndex);
  }
  function setActiveItemRef(groupIndex: number, commandIndex: number, el: any) {
    activeItemRefs.current[groupIndex * 1000 + commandIndex] = el;
  }

  return (
    <div
    className="richtext-max-h-[min(80vh,24rem)] richtext-flex-wrap richtext-overflow-y-auto richtext-overflow-x-hidden  richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none"
      data-richtext-portal
      ref={scrollContainer}
    >
      {commandQuery?.length
        ? (
          <div className="richtext-grid richtext-min-w-48 richtext-grid-cols-1 richtext-gap-0.5">
            {commandQuery?.map((group: any, groupIndex: any) => {
              return (
                <Fragment key={`slash-${group.title}`}>
                  <Label className="richtext-mx-[4px] richtext-mb-[4px] richtext-mt-[8px] !richtext-text-[0.65rem] richtext-uppercase ">
                    {group.title}
                  </Label>

                  {group.commands.map((command: any, commandIndex: any) => {
                    return (
                      <button
                        key={`command-${commandIndex}`}
                        onClick={() => createCommandClickHandler(groupIndex, commandIndex)}
                        ref={el => setActiveItemRef(groupIndex, commandIndex, el)}
                        className={cn('richtext-flex richtext-items-center richtext-gap-3 richtext-px-2 richtext-py-1.5 richtext-text-sm richtext-text-foreground richtext-text-left richtext-w-full richtext-rounded-sm !richtext-outline-none !richtext-border-none richtext-transition-colors !richtext-bg-transparent hover:!richtext-bg-accent ', {
                          'bg-item-active': selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex,
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
            <span className="richtext-text-xs richtext-text-foreground">
              {t('editor.slash.empty')}
            </span>
          </div>
        )}
    </div>
  );
}

export default forwardRef(SlashCommandNodeView);
