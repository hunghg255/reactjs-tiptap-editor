import { useState } from 'react';
import svg64 from 'svg64';

import { ActionButton } from '@/components/ActionButton';
import { LazyContent } from '@/components/LazyContent';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer } from '@/extensions/Drawer/Drawer';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useEditorInstance } from '@/store/editor';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';

const loadCanvas = () => import('./DrawerCanvas');

export function RichTextDrawer() {
  const editor = useEditorInstance();

  const buttonProps = useButtonProps<
    import('@/types').ButtonViewReturnComponentProps & { upload?: (file: File) => Promise<string> }
  >(Drawer.name);

  const { isActive = undefined, upload } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive(isActive);

  const [visible, toggleVisible] = useState(false);
  const setSvg = async (contentHtml: string) => {
    const name = `drawer-${shortId()}.svg`;

    let src = svg64(contentHtml);

    if (upload) {
      const file = dataURLtoFile(src, name);
      src = await upload(file);
    }

    editor
      ?.chain()
      .focus()
      .setDrawer(
        {
          type: 'drawer',
          src,
          alt: encodeURIComponent(contentHtml),
          width: 426,
          height: 212,
        },
        !!contentHtml
      )
      .run();
    toggleVisible(false);
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <Dialog onOpenChange={toggleVisible} open={visible}>
      <DialogTrigger asChild>
        <ActionButton
          disabled={editorDisabled}
          action={() => {
            if (editorDisabled) return;

            toggleVisible(true);
          }}
          icon='PencilRuler'
          tooltip='Drawer'
        />
      </DialogTrigger>

      <DialogContent className='richtext-z-[99999] !richtext-max-w-[1300px]'>
        <DialogTitle>Drawer</DialogTitle>

        {visible && <LazyContent load={loadCanvas} componentProps={{ onSave: setSvg }} />}
      </DialogContent>
    </Dialog>
  );
}
