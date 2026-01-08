import { createSignal, useSetSignal, useSignalValue } from 'reactjs-signal';

import { type CommandList } from '@/extensions/SlashCommand/types';

interface SignalCommandListState {
  commandList: CommandList[];
}

const useSignalCommandListStore = createSignal<SignalCommandListState>({
  commandList: [],
});

export function useSignalCommandList () {
  const commandList = useSignalValue(useSignalCommandListStore).commandList;
  const setCommandList = useSetSignal(useSignalCommandListStore);

  return [commandList, setCommandList] as const;
}
