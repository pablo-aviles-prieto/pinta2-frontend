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
  const [configuringGame, setConfiguringGame] = useState<string | undefined>(
    undefined
  );
  const { socket } = useSocket();
  const { gameState } = useGameData();

  useEffect(() => {
    if (!socket) return;

    socket.on(
      'await more players response',
      ({ message }: { message: string }) => {
        setConfiguringGame(undefined);
        setAwaitPlayersMsg(message);
      }
    );

    socket.on('game cancelled', ({ msg }: { msg: string }) => {
      setAwaitPlayersMsg(undefined);
      setConfiguringGame(undefined);
      setGameCancelled(msg);
    });

    socket.on('pre game no owner', ({ message }: { message: string }) => {
      setAwaitPlayersMsg(undefined);
      setGameCancelled(undefined);
      setConfiguringGame(message);
    });

    return () => {
      socket.off('await more players response');
      socket.off('game cancelled');
      socket.off('pre game no owner');
    };
  }, []);

  return (
    <>
      {!awaitPlayersMsg && gameCancelled && !gameState.started && (
        <div className='my-4 text-2xl font-bold text-center text-emerald-600'>
          {gameCancelled}
        </div>
      )}
      {configuringGame && !gameState.started && (
        <div className='my-4 text-2xl font-bold text-center text-emerald-600'>
          {configuringGame}
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
        setConfiguringGame={setConfiguringGame}
      />
    </>
  );
};
