import { FC } from 'react';
import { useSocket } from '../hooks/useSocket';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useCustomToast } from '../hooks/useCustomToast';

type Props = {
  redirectedURL?: string;
  browsingState?: any;
  setRedirectedURL?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const MAX_USERNAME_CHAR = 15;

export const RegisterUserForm: FC<Props> = ({
  redirectedURL,
  browsingState,
  setRedirectedURL,
}) => {
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
    if (username.length > MAX_USERNAME_CHAR) {
      showToast({
        msg: `El nombre no puede tener más de ${MAX_USERNAME_CHAR} caracteres`,
        options: { type: 'error' },
      });
      return;
    }

    if (socket && !socket?.connected) {
      socket.connect();
    }

    if (!socket) {
      const URL_BACK = import.meta.env.VITE_BACK_URL;
      const newSocket = io(URL_BACK ?? 'http://localhost:4000');
      newSocket.emit('register', username);
      setSocket(newSocket);
      setIsRegistered(true);
    }

    const redirectURL =
      redirectedURL && redirectedURL !== '/' ? redirectedURL : '/home';
    navigate(redirectURL, {
      state: { ...(browsingState || {}), notRegistered: undefined },
      replace: true,
    });
    setRedirectedURL && setRedirectedURL(undefined);
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
          className='flex-shrink-0 px-2 py-1 text-sm text-black bg-teal-400 border-4 border-teal-400 rounded hover:bg-teal-300 hover:border-teal-300'
          type='submit'
        >
          Acceder
        </button>
      </div>
    </form>
  );
};
