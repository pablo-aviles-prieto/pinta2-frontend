import { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from './components/Events';
import { MyForm } from './components/MyForm';
import { Board } from './components/Board';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatMsgs, setChatMsgs] = useState<string[]>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMsg(value: string) {
      setChatMsgs((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat msg', onChatMsg);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat msg', onChatMsg);
    };
  }, []);

  return (
    <div>
      <ConnectionState isConnected={isConnected} />
      <Events events={chatMsgs} />
      <ConnectionManager />
      <MyForm />
      <hr />
      <Board />
    </div>
  );
};

export default App;
