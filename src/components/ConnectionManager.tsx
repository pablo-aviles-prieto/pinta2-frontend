import { useSocket } from '../hooks/useSocket';

export const ConnectionManager = () => {
  const { socket, username } = useSocket();

  // TODO: Disconnect from the socket and remove the user from the room (handle a
  // remove room event in the backend)
  function disconnect() {
    socket?.disconnect();
  }

  return (
    <div className='flex items-center gap-10 py-4'>
      <p>Connected as {username}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};
