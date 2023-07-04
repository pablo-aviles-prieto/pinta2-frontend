import { FC, useEffect, useState } from 'react';
import { ConnectionManager } from '../ConnectionManager';
import { Board } from './Board';
import { useSocket } from '../../hooks/useSocket';
import { useGameData } from '../../hooks/useGameData';
import { UserList } from '../UserList/UserList';

export const BodyContainer: FC = () => {
  const [awaitPlayersMsg, setAwaitPlayersMsg] = useState<string | undefined>(
    undefined
  );
  const [gameCancelled, setGameCancelled] = useState<string | undefined>(
    undefined
  );
  const { socket, joinedRoom } = useSocket();
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
    });

    return () => {
      socket.off('await more players response');
      socket.off('game cancelled');
    };
  }, []);

  return (
    <>
      <p>Habitación: {joinedRoom}</p>
      <UserList />
      {gameCancelled && !gameState.started && (
        <div className='my-4 text-xl font-bold'>{gameCancelled}</div>
      )}
      {awaitPlayersMsg && !gameState.started && (
        <div className='my-4 text-xl font-bold'>{awaitPlayersMsg}</div>
      )}
      <ConnectionManager />
      <Board
        setAwaitPlayersMsg={setAwaitPlayersMsg}
        setGameCancelled={setGameCancelled}
      />
    </>
  );
};
