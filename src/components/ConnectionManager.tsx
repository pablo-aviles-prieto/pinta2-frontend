import { useSocket } from '../hooks/useSocket';

export const ConnectionManager = () => {
  const socket = useSocket()
  
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
};
