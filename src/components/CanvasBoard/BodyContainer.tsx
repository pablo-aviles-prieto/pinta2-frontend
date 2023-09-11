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
  const { gameState, userList } = useGameData();

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
      <div className='min-h-[28px] my-1 text-xl font-bold text-center text-emerald-600'>
        {!awaitPlayersMsg && gameCancelled && !gameState.started && (
          <span>{gameCancelled}</span>
        )}
        {configuringGame && !gameState.started && (
          <span>{configuringGame}</span>
        )}
        {awaitPlayersMsg && !gameState.started && (
          <span>{awaitPlayersMsg}</span>
        )}
        {selectingWord && gameState.started && <span>{selectingWord}</span>}
        {!awaitPlayersMsg &&
          !gameState.started &&
          !gameCancelled &&
          !configuringGame &&
          userList.length < 3 && (
            <span>
              Se necesitan al menos 3 jugadores para comenzar la partida
            </span>
          )}
      </div>
      <Board
        setAwaitPlayersMsg={setAwaitPlayersMsg}
        setGameCancelled={setGameCancelled}
        setSelectingWord={setSelectingWord}
        setConfiguringGame={setConfiguringGame}
      />
    </>
  );
};
