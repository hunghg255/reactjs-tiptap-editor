import { proxy, useSnapshot } from 'valtio'

const dialogVideo = proxy({
  isOpen: false,
})

export function useDialogVideo() {
  const snap = useSnapshot(dialogVideo)

  return snap
}

export const actionDialogVideo = {
  setOpen: (value: boolean) => {
    dialogVideo.isOpen = value
  },
}
