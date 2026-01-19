import React from 'react';

import { RenderDialogUploadImage } from '@/components/SlashDialogTrigger/RenderDialogUploadImage';
import { RenderDialogUploadVideo } from '@/components/SlashDialogTrigger/RenderDialogUploadVideo';

function SlashDialogTrigger() {
  return (
    <>
      <RenderDialogUploadImage />
      <RenderDialogUploadVideo />
    </>
  );
}

if (process.env.NODE_ENV !== 'production') {
  SlashDialogTrigger.displayName = 'SlashDialogTrigger';
}

export default SlashDialogTrigger;
