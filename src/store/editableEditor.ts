import { proxy, useSnapshot } from 'valtio'

const editableEditorProxy = proxy({
  disable: false,
})

export function useEditableEditor() {
  const editableEditor = useSnapshot(editableEditorProxy)
  return editableEditor.disable
}

export const editableEditorActions = {
  setDisable: (disable: boolean) => {
    editableEditorProxy.disable = disable
  },
}
