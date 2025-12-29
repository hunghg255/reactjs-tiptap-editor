import { create } from 'zustand';

import { type CommandList } from '@/extensions/SlashCommand/types';

interface SignalCommandListState {
  commandList: CommandList[];
  setCommandList: (newCommandList: CommandList[]) => void;
}

const useSignalCommandListStore = create<SignalCommandListState>((set => ({
  commandList: [],
  setCommandList: (newCommandList: CommandList[]) => {
    set(() => ({
      commandList: newCommandList,
    }));
  },
})));

export function useSignalCommandList () {
  const commandList = useSignalCommandListStore(state => state.commandList);
  const setCommandList = useSignalCommandListStore(state => state.setCommandList);

  return [commandList, setCommandList] as const;
}
