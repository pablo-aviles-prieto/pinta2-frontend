import { useState, useEffect } from 'react';
import { DefaultEventsMap } from '@socket.io/component-emitter';

import { RegisterForm } from '../components/RegisterForm';
import { BodyContainer } from '../components/BodyContainer';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../hooks/useSocket';

const Homepage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    if (!isRegistered || !socket) return;

    socket.on('disconnect', () => {
      setIsRegistered(false);
      setUsername('');
    });

    return () => {
      if (isRegistered) {
        socket.off('disconnect');
      }
    };
  }, [isRegistered, socket]);

  return (
    <SocketContext.Provider value={{ socket, socketUser: username }}>
      <div>
        {!isRegistered ? (
          <RegisterForm
            username={username}
            setIsRegistered={setIsRegistered}
            setUsername={setUsername}
            setSocket={setSocket}
          />
        ) : (
          <BodyContainer />
        )}
      </div>
    </SocketContext.Provider>
  );
};

export default Homepage;
