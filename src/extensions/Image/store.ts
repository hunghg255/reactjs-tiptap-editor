import { createSignal, useSignalValue } from 'reactjs-signal'

const dialogImage = createSignal(false)

export function useDialogImage() {
  return useSignalValue(dialogImage)
}

export const actionDialogImage = {
  setOpen: (value: boolean) => {
    dialogImage(value)
  },
}
