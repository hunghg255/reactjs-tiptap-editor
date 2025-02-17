import { createSignal, useSignalValue } from 'reactjs-signal'

const dialogVideo = createSignal(false)

export function useDialogVideo() {
  return useSignalValue(dialogVideo)
}

export const actionDialogVideo = {
  setOpen: (value: boolean) => {
    dialogVideo(value)
  },
}
