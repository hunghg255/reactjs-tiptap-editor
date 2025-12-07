import type { HeadingOptions as TiptapHeadingOptions } from '@tiptap/extension-heading';
import { Heading as TiptapHeading } from '@tiptap/extension-heading';

import { HEADINGS } from '@/constants';
import type { GeneralOptions } from '@/types';

export * from '@/extensions/Heading/components/RichTextHeading';

export interface HeadingOptions extends TiptapHeadingOptions, GeneralOptions<HeadingOptions> { }

export const Heading = /* @__PURE__ */ TiptapHeading.extend<HeadingOptions>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      levels: HEADINGS,
      button({ editor, extension, t }) {
        const levels = extension.options?.levels || [];

        const items: any[] = levels.map((level: any) => {
          const isDefault = level === 'Paragraph';

          return {
            action: () => {
              if (isDefault) {
                const currentActiveLevel: any = levels.find((lvl: any) => editor.isActive('heading', { level: lvl }));
                if (currentActiveLevel && currentActiveLevel !== 'Paragraph') {
                  editor.commands.toggleHeading({ level: currentActiveLevel });
                }
                return;
              }
              editor.commands.toggleHeading({ level });
            },
            isActive: () => {
              if (isDefault) {
                return false;
              }

              return editor.isActive('heading', { level }) || false;
            },
            disabled: !editor.can().toggleHeading({ level }),
            title: isDefault ? t('editor.paragraph.tooltip') : t(`editor.heading.h${level}.tooltip`),
            level,
            shortcutKeys: extension.options.shortcutKeys?.[level] ?? ['alt', 'mod', `${level}`],
            default: isDefault,
          };
        });

        const disabled = items.filter((k: any) => k.disabled).length === items.length;

        return {
          // component: HeadingButton,
          componentProps: {
            tooltip: t('editor.heading.tooltip'),
            disabled,
            items,
            icon: 'MenuDown',
            isActive: () => {
              const find: any = items?.find((k: any) => k.isActive());

              if (find && !find.default) {
                return find;
              }
              const item = {
                title: t('editor.paragraph.tooltip'),
                level: 0,
                isActive: () => false,
              };
              return item;
            },
            levels
          },
        };
      },
    };
  },
});
