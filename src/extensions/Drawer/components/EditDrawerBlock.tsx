import { useState } from 'react';
import svg64 from 'svg64';

import { ActionButton } from '@/components/ActionButton';
import { LazyContent } from '@/components/LazyContent';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';

const loadCanvas = () => import('./DrawerCanvas');

export function EditDrawerBlock({
  editor,
  attrs,
  extension,
}: {
  editor: import('@tiptap/core').Editor;
  attrs: { alt: string; align: 'left' | 'center' | 'right' };
  extension?: { options: { upload?: (file: File) => Promise<string> } } | null;
}) {
  const [visible, toggleVisible] = useState(false);
  const { alt, align } = attrs;
  const upload = extension?.options.upload;

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
    editor?.commands.setAlignImageDrawer(align);
    toggleVisible(false);
  };

  return (
    <Dialog onOpenChange={toggleVisible} open={visible}>
      <DialogTrigger asChild>
        <ActionButton action={() => toggleVisible(true)} icon='Pencil' tooltip='Edit Drawer' />
      </DialogTrigger>

      <DialogContent className='richtext-z-[99999] !richtext-max-w-[1300px]'>
        <DialogTitle>Edit Drawer</DialogTitle>

        {visible && (
          <LazyContent load={loadCanvas} componentProps={{ initialSvg: alt, onSave: setSvg }} />
        )}
      </DialogContent>
    </Dialog>
  );
}
