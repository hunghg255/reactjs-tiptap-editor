import { Extension } from '@tiptap/core';

export * from '@/extensions/TextDirection/components/RichTextTextDirection';

export * from '@/extensions/TextDirection/components/RichTextTextDirection';

const TextDirection = /* @__PURE__ */ Extension.create({
  name: 'richTextTextDirection',
  addOptions() {
    return {
      ...this.parent?.(),
      directions: ['auto', 'ltr', 'rtl', 'unset'],
      defaultDirection: 'auto',
      button({
        editor,
        extension,
        t,
      }: {
        editor: any
        extension: Extension
        t: (...args: any[]) => string
      }) {
        const directions = (extension.options?.directions as any[]) || [];

        const iconMap = {
          auto: 'TextDirection',
          ltr: 'LeftToRight',
          rtl: 'RightToLeft',
          unset: 'X',
        } as any;

        const items = directions.map(k => ({
          title: t(`editor.textDirection.${k}.tooltip`),
          value: k,
          icon: iconMap[k],
          action: () => {
            if (k === 'unset') {
              editor.commands?.unsetTextDirection?.();
              return;
            }

            editor.commands?.setTextDirection?.(k);
          },
          disabled: false,
        }));

        return {
          componentProps: {
            icon: 'TextDirection',
            tooltip: t('editor.textDirection.tooltip'),
            items,
            isActive: () => editor.getAttributes('paragraph'),
          },
        };
      },
    };
  },
});

export { TextDirection };
