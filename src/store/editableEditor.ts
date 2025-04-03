import { useStoreEditableEditor } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

export function useEditableEditor() {
  const [v] = useStoreEditableEditor(store => store.value);

  return v;
}

export const editableEditorActions = {
  setDisable: (id: any, disable: boolean) => {
    dispatchEvent(EVENTS.EDIT(id), disable);
  },
};
