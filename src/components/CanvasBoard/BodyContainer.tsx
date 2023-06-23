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

    return () => {
      socket.off('await more players response');
    };
  }, []);

  return (
    <>
      <p>Habitación: {joinedRoom}</p>
      <UserList />
      {awaitPlayersMsg && !gameState.started && (
        <div className='my-4 text-xl font-bold'>{awaitPlayersMsg}</div>
      )}
      <ConnectionManager />
      <Board />
    </>
  );
};
