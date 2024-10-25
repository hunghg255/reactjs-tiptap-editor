import { proxy, useSnapshot } from 'valtio'

const dialogImage = proxy({
  isOpen: false,
})

export function useDialogImage() {
  const snap = useSnapshot(dialogImage)

  return snap
}

export const actionDialogImage = {
  setOpen: (value: boolean) => {
    dialogImage.isOpen = value
  },
}
