import { FC } from 'react';
import { ConnectionManager } from '../ConnectionManager';
import { Board } from './Board';
import { useSocket } from '../../hooks/useSocket';

export const BodyContainer: FC = () => {
  const { joinedRoom } = useSocket();

  return (
    <>
      <p>Room: {joinedRoom}</p>
      <ConnectionManager />
      <Board />
    </>
  );
};
