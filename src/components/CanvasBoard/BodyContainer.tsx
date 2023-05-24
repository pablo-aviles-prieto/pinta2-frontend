import { FC } from 'react';
import { ConnectionManager } from '../ConnectionManager';
import { Board } from './Board';
import { useSocket } from '../../hooks/useSocket';
import { useGameData } from '../../hooks/useGameData';

export const BodyContainer: FC = () => {
  const { joinedRoom } = useSocket();
  const { userList } = useGameData();

  return (
    <>
      <p>Room: {joinedRoom}</p>
      <div className='my-4'>
        Users list:
        <ul>
          {userList.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
      <ConnectionManager />
      <Board />
    </>
  );
};
