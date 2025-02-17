import { createSignal, useSignalValue } from 'reactjs-signal'

const editableEditorProxy = createSignal(false)

export function useEditableEditor() {
  return useSignalValue(editableEditorProxy)
}

export const editableEditorActions = {
  setDisable: (disable: boolean) => {
    editableEditorProxy(disable)
  },
}
