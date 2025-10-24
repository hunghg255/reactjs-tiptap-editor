import React, { useCallback } from 'react';

import type { Editor } from '@tiptap/core';
import { ActionButton } from '@/components/ActionButton';
import { TableOfContents } from '@/extensions/TableOfContent/TableOfContent';
import { useActive } from '@/hooks/useActive';

import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export function TableOfContentActionButton({ editor, icon, tooltip, tooltipOptions }: { editor: Editor, tooltip: string, icon: string, tooltipOptions?: TooltipContentProps }) {
  const isTaskListActive = useActive(editor, TableOfContents.name);

  const tableOfContent = useCallback(() => {
    if (isTaskListActive) {
      editor.chain().focus().removeTableOfContents().run();
      return;
    }
    editor.chain().focus().setTableOfContents().run();
  }, [editor, isTaskListActive]);

  return (
    <ActionButton
      action={tableOfContent}
      isActive={() => isTaskListActive || false}
      icon={icon}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
    />
  );
}
