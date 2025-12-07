import { CommandList } from '@/extensions/SlashCommand/types';
import { createSignal, useSignal } from 'reactjs-signal';

const signalCommandList = createSignal<CommandList[]>([]);

export function useSignalCommandList () {
  const [commandList, setCommandList] = useSignal(signalCommandList);

  return [commandList, setCommandList] as const;
}
