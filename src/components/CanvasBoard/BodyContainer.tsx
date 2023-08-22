import { FC, useEffect, useState } from 'react';
import { Board } from './Board';
import { useSocket } from '../../hooks/useSocket';
import { useGameData } from '../../hooks/useGameData';

export const BodyContainer: FC = () => {
  const [awaitPlayersMsg, setAwaitPlayersMsg] = useState<string | undefined>(
    undefined
  );
  const [gameCancelled, setGameCancelled] = useState<string | undefined>(
    undefined
  );
  const [selectingWord, setSelectingWord] = useState<string | undefined>(
    undefined
  );
  const { socket } = useSocket();
  const { gameState } = useGameData();

  useEffect(() => {
    if (!socket) return;

    socket.on(
      'await more players response',
      ({ message }: { message: string }) => {
        setAwaitPlayersMsg(message);
      }
    );
    socket.on('game cancelled', ({ msg }: { msg: string }) => {
      setGameCancelled(msg);
      setAwaitPlayersMsg(undefined);
    });

    return () => {
      socket.off('await more players response');
      socket.off('game cancelled');
    };
  }, []);

  return (
    <>
      {!awaitPlayersMsg && gameCancelled && !gameState.started && (
        <div className='my-4 text-2xl font-bold text-center text-emerald-600'>
          {gameCancelled}
        </div>
      )}
      {awaitPlayersMsg && !gameState.started && (
        <div className='my-4 text-2xl font-bold text-center text-emerald-600'>
          {awaitPlayersMsg}
        </div>
      )}
      {selectingWord && gameState.started && (
        <div className='my-4 text-2xl font-bold text-center text-emerald-600'>
          {selectingWord}
        </div>
      )}
      <Board
        setAwaitPlayersMsg={setAwaitPlayersMsg}
        setGameCancelled={setGameCancelled}
        setSelectingWord={setSelectingWord}
      />
    </>
  );
};
