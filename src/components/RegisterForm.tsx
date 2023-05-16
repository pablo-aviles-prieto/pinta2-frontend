import { FC } from 'react';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useSocket } from '../hooks/useSocket';
import { Socket, io } from 'socket.io-client';

interface PropsI {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  >;
}

export const RegisterForm: FC<PropsI> = ({
  username,
  setUsername,
  setIsRegistered,
  setSocket,
}) => {
  const { socket } = useSocket();

  const registerUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket) {
      const newSocket = io('http://localhost:4000');
      newSocket.emit('register', username);
      setSocket(newSocket);
    }

    if (socket && !socket?.connected) {
      socket.connect();
    }

    socket?.emit('register', username);
    setIsRegistered(true);
  };

  return (
    <form onSubmit={registerUser}>
      <label htmlFor='username'>Nickname</label>
      <input
        type='text'
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        id='username'
        name='username'
        placeholder='Enter a user name'
      />
      <button type='submit'>Join</button>
    </form>
  );
};
