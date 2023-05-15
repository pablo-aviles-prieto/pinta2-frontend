import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { RegisterForm } from '../components/RegisterForm';
import { BodyContainer } from '../components/BodyContainer';

const Homepage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!isRegistered) return;

    socket.on('disconnect', () => {
      setIsRegistered(false);
      setUsername('');
    });

    return () => {
      if (isRegistered) {
        socket.off('disconnect');
      }
    };
  }, [isRegistered]);

  return (
    <div>
      {!isRegistered ? (
        <RegisterForm
          username={username}
          setIsRegistered={setIsRegistered}
          setUsername={setUsername}
        />
      ) : (
        <BodyContainer />
      )}
    </div>
  );
};

export default Homepage;
