import { FC } from 'react';
import { useSocket } from '../hooks/useSocket';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useCustomToast } from '../hooks/useCustomToast';

export const RegisterUserForm: FC = () => {
  const { socket, username, setUsername, setSocket, setIsRegistered } =
    useSocket();
  const navigate = useNavigate();
  const { showToast } = useCustomToast();

  const registerUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      showToast({
        msg: 'Introduzca un nombre válido',
        options: { type: 'error' },
      });
      return;
    }

    if (socket && !socket?.connected) {
      socket.connect();
    }

    if (!socket) {
      const newSocket = io('http://localhost:4000');
      newSocket.emit('register', username);
      setSocket(newSocket);
      setIsRegistered(true);
    }

    navigate('/home');
  };

  return (
    <form className='w-full max-w-sm' onSubmit={registerUser}>
      <div className='flex items-end py-1 border-t border-b border-teal-500'>
        <input
          className='w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none'
          type='text'
          id='username'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Nombre de usuario'
          aria-label='User name'
        />
        <button
          className='flex-shrink-0 px-2 py-1 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700'
          type='submit'
        >
          Acceder
        </button>
      </div>
    </form>
  );
};
