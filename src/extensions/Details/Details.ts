import {
  Details as TiptapDetails,
  DetailsContent as TiptapDetailsContent,
  DetailsSummary as TiptapDetailsSummary,
} from '@tiptap/extension-details';

import { ActionButton } from '@/components';

import type { GeneralOptions } from '@/types';
import type {
  DetailsContentOptions,
  DetailsOptions as TiptapDetailsOptions,
  DetailsSummaryOptions,
} from '@tiptap/extension-details';

export * from './components/RichTextDetails';

export interface DetailsOptions extends TiptapDetailsOptions, GeneralOptions<DetailsOptions> {
  /**
   * Options forwarded to the nested `detailsSummary` node.
   */
  summary: Partial<DetailsSummaryOptions>;
  /**
   * Options forwarded to the nested `detailsContent` node.
   */
  content: Partial<DetailsContentOptions>;
}

export const DetailsSummary = /* @__PURE__ */ TiptapDetailsSummary.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'details-summary',
      },
    };
  },
});

export const DetailsContent = /* @__PURE__ */ TiptapDetailsContent.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'details-content',
      },
    };
  },
});

/**
 * Collapsible (toggle) block. Registers the `details`, `detailsSummary` and
 * `detailsContent` nodes, so only `Details` needs to be added to the editor.
 */
export const Details = /* @__PURE__ */ TiptapDetails.extend<DetailsOptions>({
  // @ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      persist: true,
      HTMLAttributes: {
        class: 'details',
      },
      summary: {},
      content: {},
      button: ({ editor, t, extension }) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            if (editor.isActive('details')) {
              editor.chain().focus().unsetDetails().run();
              return;
            }

            editor.chain().focus().setDetails().run();
          },
          isActive: () => editor.isActive('details') || false,
          disabled: false,
          icon: 'Details',
          shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'alt', 'D'],
          tooltip: t('editor.details.tooltip'),
        },
      }),
    };
  },

  addExtensions() {
    return [
      DetailsSummary.configure(this.options.summary),
      DetailsContent.configure(this.options.content),
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-Alt-d': () => {
        if (this.editor.isActive('details')) {
          return this.editor.commands.unsetDetails();
        }

        return this.editor.commands.setDetails();
      },
    };
  },
});
