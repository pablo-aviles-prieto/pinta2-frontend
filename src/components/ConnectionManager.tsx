import { useSocket } from '../hooks/useSocket';

export const ConnectionManager = () => {
  const { socket, username, setJoinedRoom, setRoomPassword } = useSocket();

  function disconnect() {
    socket?.disconnect();
    setJoinedRoom(undefined);
    setRoomPassword('');
  }

  return (
    <div className='flex items-center gap-10 py-4'>
      <p>Connected as {username}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};
