import { type Editor } from '@tiptap/core';

import createFastContext from '@/store/fast-context';

interface IProviderEditorProps {
  editor: Editor & { id: string };
}

const { Provider: ProviderEditor, useStore: useStoreEditor } = createFastContext<IProviderEditorProps>({
  editor: null as any,
});

function useEditorInstance() {
  const [editor] = useStoreEditor((store) => store.editor);
  return editor;
}

export {
  ProviderEditor,
  useStoreEditor,
  useEditorInstance
};
