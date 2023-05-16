import { useSocket } from '../hooks/useSocket';

export const ConnectionManager = () => {
  const { socket, socketUser } = useSocket();

  function disconnect() {
    socket?.disconnect();
  }

  return (
    <div className='flex items-center py-4'>
      <p>Connected as {socketUser}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};
