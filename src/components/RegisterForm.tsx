import { FC } from 'react';
import { useSocket } from '../hooks/useSocket';

interface PropsI {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegisterForm: FC<PropsI> = ({
  username,
  setUsername,
  setIsRegistered,
}) => {
  const socket = useSocket();

  const registerUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('register', username);
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
