import { useStoreEditableEditor } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { eventName } from '@/utils/customEvents/events.constant';

export function useEditableEditor() {
  const [v] = useStoreEditableEditor(store => store.value);

  return v;
}

export const editableEditorActions = {
  setDisable: (disable: boolean) => {
    dispatchEvent(eventName.getEventNameEdit(), disable);
  },
};
