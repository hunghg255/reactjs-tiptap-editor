import { useCallback, useState } from 'react';

import { LazyContent } from '@/components/LazyContent';
import { useListener } from '@/components/ReactBus';
import { EVENTS } from '@/utils/customEvents/events.constant';

const loadImageDialog = () =>
  import('./RenderDialogUploadImage').then((module) => ({
    default: module.RenderDialogUploadImage,
  }));
const loadVideoDialog = () =>
  import('./RenderDialogUploadVideo').then((module) => ({
    default: module.RenderDialogUploadVideo,
  }));

export interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function useDialogState() {
  const [state, setState] = useState({ requested: false, open: false });
  const onOpenChange = useCallback((open: boolean) => {
    setState((previous) => ({ requested: previous.requested || open, open }));
  }, []);
  return { ...state, onOpenChange };
}

function SlashDialogTrigger({ editorId }: { editorId: string }) {
  const image = useDialogState();
  const video = useDialogState();
  useListener(image.onOpenChange, [EVENTS.UPLOAD_IMAGE(editorId)]);
  useListener(video.onOpenChange, [EVENTS.UPLOAD_VIDEO(editorId)]);

  return (
    <>
      {image.requested && (
        <LazyContent
          load={loadImageDialog}
          componentProps={{ open: image.open, onOpenChange: image.onOpenChange }}
        />
      )}
      {video.requested && (
        <LazyContent
          load={loadVideoDialog}
          componentProps={{ open: video.open, onOpenChange: video.onOpenChange }}
        />
      )}
    </>
  );
}

if (process.env.NODE_ENV !== 'production') {
  SlashDialogTrigger.displayName = 'SlashDialogTrigger';
}

export default SlashDialogTrigger;
