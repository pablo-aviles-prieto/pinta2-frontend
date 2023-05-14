import { io } from 'socket.io-client';
import { SocketContext } from './hooks/useSocket';
import Main from './pages/Main';

const socket = io('http://localhost:4000');

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Main />
    </SocketContext.Provider>
  );
};

export default App;
