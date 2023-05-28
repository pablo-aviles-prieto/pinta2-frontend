import { FC } from 'react';
import { useSocket } from '../hooks/useSocket';
import { io } from 'socket.io-client';

interface PropsI {
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegisterUserForm: FC<PropsI> = ({ setIsRegistered }) => {
  const { socket, username, setUsername, setSocket } = useSocket();

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
    <form className='w-full max-w-sm' onSubmit={registerUser}>
      <div className='flex items-center py-2 border-b border-teal-500'>
        <input
          className='w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none'
          type='text'
          id='username'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Enter a user name'
          aria-label='User name'
        />
        <button
          className='flex-shrink-0 px-2 py-1 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700'
          type='submit'
        >
          Join
        </button>
      </div>
    </form>
  );
};
