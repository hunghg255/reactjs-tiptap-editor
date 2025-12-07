/* eslint-disable @typescript-eslint/ban-ts-comment */
import { actionDialogImage } from '@/extensions/Image/store';
import { actionDialogVideo } from '@/extensions/Video/store';

import type { CommandList } from './types';

export function renderCommandListDefault({ t }: any) {
  const groups: CommandList[] = [
    {
      name: 'format',
      title: t('editor.slash.format'),
      commands: [

      ],
    },
    {
      name: 'insert',
      title: t('editor.slash.insert'),
      commands: [],
    },
  ];

   // heading
  [1, 2, 3, 4, 5, 6].forEach((level: any) => {
    groups[0].commands.push({
      name: `heading${level}`,
      label: t(`editor.heading.h${level}.tooltip`),
      aliases: [`h${level}`, 'bt', `bt${level}`],
      iconName: `Heading${level}`,
      action: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level }).run();
      },
    });
  });

  //bulletlist
  groups[0].commands.push({
    name: 'bulletList',
    label: t('editor.bulletlist.tooltip'),
    aliases: ['ul', 'yxlb'],
    iconName: 'List',
    action: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  });

  //orderedlist
  groups[0].commands.push({
    name: 'numberedList',
    label: t('editor.orderedlist.tooltip'),
    aliases: ['ol', 'yxlb'],
    iconName: 'ListOrdered',
    action: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  });

  // tasklist
  groups[0].commands.push({
    name: 'taskList',
    label: t('editor.tasklist.tooltip'),
    iconName: 'ListTodo',
    description: 'Task list with todo items',
    aliases: ['todo'],
    action: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  });

  // blockquote
  groups[0].commands.push({
    name: 'blockquote',
    label: t('editor.blockquote.tooltip'),
    description: '插入引入格式',
    aliases: ['yr'],
    iconName: 'TextQuote',
    action: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run();
    },
  });

  // codeblock
  groups[0].commands.push({
    name: 'codeBlock',
    label: t('editor.codeblock.tooltip'),
    iconName: 'Code2',
    description: 'Code block with syntax highlighting',
    shouldBeHidden: editor => editor.isActive('columns'),
    action: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  });

  /* Insert */
  // name
  groups[1].commands.push({
    name: 'image',
    label: t('editor.image.tooltip'),
    iconName: 'ImageUp',
    description: 'Insert a image',
    aliases: ['image', 'tp', 'tupian'],
    shouldBeHidden: editor => editor.isActive('columns'),
    action: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();

      actionDialogImage.setOpen(editor.id, true);
    },
  });

  // video
  groups[1].commands.push({
    name: 'video',
    label: t('editor.video.tooltip'),
    iconName: 'Video',
    description: 'Insert a video',
    aliases: ['video', 'sp', 'shipin'],
    shouldBeHidden: editor => editor.isActive('columns'),
    action: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
      actionDialogVideo.setOpen(editor.id, true);
    },
  });

  // table
  groups[1].commands.push({
    name: 'table',
    label: t('editor.table.tooltip'),
    iconName: 'Table',
    description: 'Insert a table',
    aliases: ['table', 'bg', 'biaoge', 'biao'],
    shouldBeHidden: editor => editor.isActive('columns'),
    action: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
        .run();
    },
  });

  //horizontalrule
  groups[1].commands.push({
    name: 'horizontalRule',
    label: t('editor.horizontalrule.tooltip'),
    iconName: 'Minus',
    description: 'Insert a horizontal divider',
    aliases: ['hr', 'fgx', 'fg'],
    action: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  });

  // columns
  groups[1].commands.push({
    name: 'columns',
    label: t('editor.columns.tooltip'),
    iconName: 'Columns2',
    description: 'Add two column content',
    action: ({ editor }) => {
      editor.chain().focus().insertColumns({ cols: 2 }).run();
    },
  });

  return groups;
}

export function useFilterCommandList (commandList: CommandList[], query: string) {
  const withFilteredCommands = commandList.map(group => ({
    ...group,
    commands: group.commands
      .filter((item) => {
        const labelNormalized = item.label.toLowerCase().trim();
        const queryNormalized = query.toLowerCase().trim();

        if (item.aliases) {
          const aliases = item.aliases.map(alias => alias.toLowerCase().trim());
          const labelMatch = labelNormalized.match(queryNormalized);
          const aliasMatch = aliases.some(alias => alias.match(queryNormalized));

          return labelMatch || aliasMatch;
        }

        return labelNormalized.match(queryNormalized);
      }),
  }));
  // Remove empty groups
  const withoutEmptyGroups = withFilteredCommands.filter((group) => {
    if (group.commands.length > 0) {
      return true;
    }

    return false;
  });

  return withoutEmptyGroups;
}
