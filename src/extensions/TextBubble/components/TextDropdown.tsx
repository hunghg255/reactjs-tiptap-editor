import React, { useMemo } from 'react';

import { ChevronDown } from 'lucide-react';

import icons from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/locales';

interface IPropsTextDropdown {
  editor: any;
  disabled?: boolean;
  color?: string;
  maxHeight?: string | number;
  icon?: any;
  tooltip?: string;
}

const TextDropdown = (props: IPropsTextDropdown) => {
  const { t } = useLocale();

  const menus = useMemo(() => {
    return [
      {
        name: 'paragraph',
        label: t('editor.paragraph.tooltip'),
        iconName: 'Heading1',
        isActive: () =>
          props.editor.isActive('paragraph') &&
          !props.editor.isActive('orderedList') &&
          !props.editor.isActive('bulletList') &&
          !props.editor.isActive('taskList'),
        action: () => props.editor.chain().focus().clearNodes().run(),
      },
      {
        name: 'heading1',
        label: t('editor.heading.h1.tooltip'),
        isActive: () => props.editor.isActive('heading', { level: 1 }),
        iconName: 'Heading1',
        action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
      },
      {
        name: 'heading2',
        label: t('editor.heading.h2.tooltip'),
        isActive: () => props.editor.isActive('heading', { level: 2 }),
        iconName: 'Heading2',
        action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
      },
      {
        name: 'heading3',
        label: t('editor.heading.h3.tooltip'),
        isActive: () => props.editor.isActive('heading', { level: 3 }),
        iconName: 'Heading3',
        action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
      },
      {
        name: 'bulletList',
        label: t('editor.bulletlist.tooltip'),
        isActive: () => props.editor.isActive('bulletList'),
        iconName: 'List',
        action: () => props.editor.chain().focus().clearNodes().toggleBulletList().run(),
      },
      {
        name: 'numberedList',
        label: t('editor.orderedlist.tooltip'),
        isActive: () => props.editor.isActive('orderedList'),
        iconName: 'ListOrdered',
        action: () => props.editor.chain().focus().clearNodes().toggleOrderedList().run(),
      },
      {
        name: 'taskList',
        label: t('editor.tasklist.tooltip'),
        isActive: () => props.editor.isActive('taskList'),
        iconName: 'ListTodo',
        action: () => props.editor.chain().focus().clearNodes().toggleTaskList().run(),
      },
      {
        name: 'blockquote',
        label: t('editor.blockquote.tooltip'),
        isActive: () => props.editor.isActive('blockquote'),
        iconName: 'TextQuote',
        action: () => props.editor.chain().focus().clearNodes().toggleBlockquote().run(),
      },
      {
        name: 'codeBlock',
        label: t('editor.codeblock.tooltip'),
        isActive: () => props.editor.isActive('codeBlock'),
        iconName: 'Code2',
        action: () => props.editor.chain().focus().clearNodes().toggleCodeBlock().run(),
      },
    ];
  }, [props.editor, t]);

  const activeItem = useMemo(() => {
    return (
      menus.filter((item) => item.isActive()).pop() ?? {
        label: 'Empty',
      }
    );
  }, [menus]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant='ghost' className='h-[32px] flex gap-1 px-1.5'>
            <span className='whitespace-nowrap text-sm font-normal'> {activeItem?.label}</span>
            <ChevronDown className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent hideWhenDetached className='w-full p-1' align='start' sideOffset={5}>
          {menus.map((item, index) => {
            const Icon = icons[item.iconName as any];

            return (
              <DropdownMenuCheckboxItem
                key={index}
                checked={item.isActive?.() || false}
                onClick={() => item.action()}
                className='cursor-pointer'
              >
                <div className='flex items-center gap-2 px-2'>
                  <Icon className='h3 w-3' />
                  <span> {item.label}</span>
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TextDropdown;
