import { FC, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useGenericTimer } from '../hooks/useGenericTimer';
import { useGameData } from '../hooks/useGameData';

interface PropsI {
  haveCustomWords: boolean;
  closeModalOwner: () => void;
  setAwaitPlayersMsg: (value: React.SetStateAction<string | undefined>) => void;
  setGameCancelled: (value: React.SetStateAction<string | undefined>) => void;
  setSelectingWord: (value: React.SetStateAction<string | undefined>) => void;
  setConfiguringGame: (value: React.SetStateAction<string | undefined>) => void;
  setHaveCustomWords: (value: React.SetStateAction<boolean>) => void;
  setHandleConfigGameCounter: (handle: (boolean: boolean) => void) => void;
}

export const GameConfigCountDown: FC<PropsI> = ({
  haveCustomWords,
  closeModalOwner,
  setAwaitPlayersMsg,
  setGameCancelled,
  setSelectingWord,
  setConfiguringGame,
  setHaveCustomWords,
  setHandleConfigGameCounter,
}) => {
  const { socket, joinedRoom } = useSocket();
  const { categorySelected, turnDuration } = useGameData();
  const {
    count: configGameCounter,
    handleCounterState: handleConfigGameCounter,
  } = useGenericTimer({
    initTimerValue: 30,
    onCountDownComplete: () => {
      socket?.emit('init game', {
        roomNumber: joinedRoom,
        turnDuration: (turnDuration ?? 120) * 1000,
        categorySelected,
      });
      closeModalOwner();
      setAwaitPlayersMsg(undefined);
      setGameCancelled(undefined);
      setSelectingWord(undefined);
      setConfiguringGame(undefined);
      setHaveCustomWords(false);
    },
  });
  useEffect(() => {
    setHandleConfigGameCounter(handleConfigGameCounter);
  }, [handleConfigGameCounter]);

  useEffect(() => {
    if (haveCustomWords) return;
    handleConfigGameCounter(true);
  }, []);

  return <>{configGameCounter}</>;
};
