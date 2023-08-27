import { FC, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useGenericTimer } from '../hooks/useGenericTimer';

interface PropsI {
  possibleWords: string[];
  closeWordsModal: () => void;
  setHandleSelectWordCount: (handle: (boolean: boolean) => void) => void;
}

export const WordCountDown: FC<PropsI> = ({
  possibleWords,
  closeWordsModal,
  setHandleSelectWordCount,
}) => {
  const { socket, joinedRoom } = useSocket();
  const {
    count: selectWordCounter,
    handleCounterState: handleSelectWordCount,
  } = useGenericTimer({
    initTimerValue: 10,
    onCountDownComplete: () => {
      const randomIndex = Math.floor(Math.random() * 3); // random number [0-2]
      socket?.emit('set drawer word', {
        roomNumber: joinedRoom,
        word: possibleWords[randomIndex],
      });
      closeWordsModal();
    },
  });

  useEffect(() => {
    setHandleSelectWordCount(handleSelectWordCount);
  }, [handleSelectWordCount]);

  useEffect(() => {
    handleSelectWordCount(true);
  }, []);

  return <>{selectWordCounter}</>;
};
