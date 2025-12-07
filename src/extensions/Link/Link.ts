/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mergeAttributes } from '@tiptap/core';
import type { LinkOptions as TiptapLinkOptions } from '@tiptap/extension-link';
import { Link as TiptapLink } from '@tiptap/extension-link';

import type { GeneralOptions } from '@/types';

export * from '@/extensions/Link/components/RichTextLink';

export interface LinkOptions
  extends TiptapLinkOptions,
  GeneralOptions<LinkOptions> {}

export const Link = /* @__PURE__ */ TiptapLink.extend<LinkOptions>({
  inclusive: false,
  parseHTML() {
    return [
      {
        tag: 'a[href]:not([data-type="button"]):not([href *= "javascript:" i])',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'link',
      }),
      0,
    ];
  },

  //@ts-expect-error
  addOptions() {
    const parentOptions = this.parent?.() || {};
    //@ts-expect-error
    const presetTarget = parentOptions.HTMLAttributes?.target;
    return {
      ...parentOptions,
      openOnClick: false,
      button: ({ editor, t }) => {
        return {
          componentProps: {
            action: (value) => {
              const { link, text, openInNewTab } = value;

              if(!link) {
                // if user clears the link and applies, remove the link
                editor.chain().extendMarkRange('link').unsetLink().run();
                return;
              }

              // if cursor is inside a link, select the entire link first
              if (editor.isActive('link')) {
                editor.chain().extendMarkRange('link').run();
              }

              const { from } = editor.state.selection;
              const insertedLength = text.length;

              editor
                .chain()
                .insertContent({
                  type: 'text',
                  text,
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: /^https?:\/\//i.test(link) ? link : `http://${link}`,
                        target: presetTarget ?? (openInNewTab ? '_blank' : ''),
                      },
                    },
                  ],
                })
                .setLink({ href: link })
                .setTextSelection({ from, to: from + insertedLength })
                .focus()
                .run();
            },
            isActive: () => editor.isActive('link'),
            disabled: !editor.can().setLink({ href: '' }),
            icon: 'Link',
            tooltip: t('editor.link.tooltip'),
            target: presetTarget,
          },
        };
      },
    };
  },

  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       key: new PluginKey(`richtextCustomPlugin${this.name}`),
  //       props: {
  //         handleClick: (view: EditorView, pos: number) => {
  //           const { schema, doc, tr } = view.state;
  //           const range = getMarkRange(doc.resolve(pos), schema.marks.link);
  //           if (!range) {
  //             return false;
  //           }

  //           // honor openOnClick setting
  //           let mark: any = null;
  //           doc.nodesBetween(range.from, range.to, (node) => {
  //             mark = node.marks.find((m) => m.type === schema.marks.link);
  //             return !mark;
  //           });
  //           if (this.options.openOnClick && mark?.attrs.href && pos !== range.to) {
  //             window.open(mark.attrs.href, mark.attrs.target || '_self');
  //             return true;
  //           }

  //           const $start = doc.resolve(range.from);
  //           const $end = doc.resolve(range.to);
  //           const transaction = tr.setSelection(
  //             new TextSelection($start, $end)
  //           );
  //           view.dispatch(transaction);
  //         },
  //       },
  //     }),
  //   ];
  // },
});
