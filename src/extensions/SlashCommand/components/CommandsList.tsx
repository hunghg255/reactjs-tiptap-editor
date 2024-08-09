/* eslint-disable multiline-ternary */
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import Icon from '@/components/icons/Icon';
import { useLocale } from '@/locales';

const CommandsList = (props: any, ref: any) => {
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
      className='bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800 text-black max-h-[min(80vh,24rem)] overflow-auto flex-wrap mb-8 p-1'
      ref={scrollContainer}
    >
      {props?.items?.length ? (
        <div className='grid grid-cols-1 gap-0.5 min-w-48'>
          {props?.items?.map((group: any, groupIndex: any) => {
            return (
              <Fragment key={group.title}>
                <div className='text-neutral-500 text-[0.65rem] col-[1/-1] mx-2 mt-2 font-semibold tracking-wider select-none uppercase first:mt-0.5'>
                  {group.title}
                </div>

                {group.commands.map((command: any, commandIndex: any) => {
                  return (
                    <button
                      className={`flex items-center gap-3 px-2 py-1.5 text-sm text-neutral-800 dark:text-neutral-200 text-left w-full rounded-sm outline-none transition-colors ${
                        selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
                          ? 'bg-accent text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
                          : 'hover:bg-accent hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200'
                      }`}
                      ref={(el) => setActiveItemRef(groupIndex, commandIndex, el)}
                      key={`command-${commandIndex}`}
                      onClick={() => createCommandClickHandler(groupIndex, commandIndex)}
                    >
                      {command.iconUrl && <img className='w-6 h-6' src={command.iconUrl} alt='' />}
                      {command.iconName && (
                        <Icon name={command.iconName} className='mr-1 text-lg' />
                      )}
                      {command.label}
                    </button>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <div className='p-3'>
          <span className='text-xs text-gray-800 dark:text-gray-100'>
            {t('editor.slash.empty')}
          </span>
        </div>
      )}
    </div>
  );
};

export default forwardRef(CommandsList);
