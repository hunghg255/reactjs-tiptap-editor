import { renderCommandListDefault } from '@/extensions/SlashCommand/renderCommandListDefault';
import { CommandList } from '@/extensions/SlashCommand/types';
import { useLocale } from '@/locales';
import { useSignalCommandList } from '@/store/commandList';
import { useEffect } from 'react';

interface SlashCommandListProps {
  // Define any props needed for the SlashCommandList component
  commandList?: CommandList[]
}

export function SlashCommandList ({ commandList }: SlashCommandListProps) {
  const [, setSignalCommandListValue] = useSignalCommandList();
  const { t } = useLocale();

  useEffect(() => {
    if (!commandList?.length) {
      const defaultCommands = renderCommandListDefault({ t });
      setSignalCommandListValue(defaultCommands as any);
      return;
    }

    setSignalCommandListValue(commandList as any);
  }, [t, commandList]);

  return <></>;
}
