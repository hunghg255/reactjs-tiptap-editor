/* eslint-disable @typescript-eslint/no-unused-vars */
import { Editor } from '@tiptap/core';

import { localeActions } from '@/locales';
// import { hasExtension } from '@/utils/utils';

import { Group } from './types';

export function renderGroups(editor: any) {
  const groups: Group[] = [
    {
      name: 'format',
      title: localeActions.t('editor.slash.format'),
      commands: [
        {
          name: 'heading1',
          label: localeActions.t('editor.heading.h1.tooltip'),
          aliases: ['h1', 'bt', 'bt1'],
          iconName: 'Heading1',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
          },
        },
        {
          name: 'heading2',
          label: localeActions.t('editor.heading.h2.tooltip'),
          aliases: ['h2', 'bt', 'bt2'],
          iconName: 'Heading2',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
          },
        },
        {
          name: 'heading3',
          label: localeActions.t('editor.heading.h3.tooltip'),
          aliases: ['h3', 'bt', 'bt3'],
          iconName: 'Heading3',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
          },
        },
        {
          name: 'bulletList',
          label: localeActions.t('editor.bulletlist.tooltip'),
          aliases: ['ul', 'yxlb'],
          iconName: 'List',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
          },
        },
        {
          name: 'numberedList',
          label: localeActions.t('editor.orderedlist.tooltip'),
          aliases: ['ol', 'yxlb'],
          iconName: 'ListOrdered',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          },
        },
        {
          name: 'taskList',
          label: localeActions.t('editor.tasklist.tooltip'),
          iconName: 'ListTodo',
          description: 'Task list with todo items',
          aliases: ['todo'],
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
          },
        },
        {
          name: 'blockquote',
          label: localeActions.t('editor.blockquote.tooltip'),
          description: '插入引入格式',
          aliases: ['yr'],
          iconName: 'TextQuote',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setBlockquote().run();
          },
        },
        {
          name: 'codeBlock',
          label: localeActions.t('editor.codeblock.tooltip'),
          iconName: 'Code2',
          description: 'Code block with syntax highlighting',
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run();
          },
        },
      ],
    },
    {
      name: 'insert',
      title: localeActions.t('editor.slash.insert'),
      commands: [
        {
          name: 'image',
          label: localeActions.t('editor.image.tooltip'),
          iconName: 'ImageUp',
          description: 'Insert a image',
          aliases: ['image', 'tp', 'tupian'],
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setImageUpload().run();
          },
        },
        {
          name: 'video',
          label: localeActions.t('editor.video.tooltip'),
          iconName: 'Video',
          description: 'Insert a video',
          aliases: ['video', 'sp', 'shipin'],
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setVideoUpload().run();
          },
        },
        {
          name: 'table',
          label: localeActions.t('editor.table.tooltip'),
          iconName: 'Table',
          description: 'Insert a table',
          aliases: ['table', 'bg', 'biaoge', 'biao'],
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
              .run();
          },
        },
        {
          name: 'horizontalRule',
          label: localeActions.t('editor.horizontalrule.tooltip'),
          iconName: 'Minus',
          description: 'Insert a horizontal divider',
          aliases: ['hr', 'fgx', 'fg'],
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
          },
        },

        // {
        //   name: 'columns',
        //   label: localeActions.t('editor.columns.tooltip'),
        //   iconName: 'Columns2',
        //   description: 'Add two column content',
        //   aliases: ['columns', 'cols', '2cols'],
        //   shouldBeHidden: (editor) => editor.isActive('columns'),
        //   action: ({ editor, range }) => {
        //     editor
        //       .chain()
        //       .deleteRange(range)
        //       .setColumns()
        //       .focus(editor.state.selection.head - 1)
        //       .run();
        //   },
        // },
      ],
    },
  ];

  return groups;
}
