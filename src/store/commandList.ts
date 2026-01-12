import { createSignal, useSignal } from 'reactjs-signal';

import { type CommandList } from '@/extensions/SlashCommand/types';

const useSignalCommandListStore = createSignal<CommandList[]>([]);

export function useSignalCommandList () {
  const [commandList, setCommandList] = useSignal(useSignalCommandListStore);

  return [commandList, setCommandList] as const;
}
