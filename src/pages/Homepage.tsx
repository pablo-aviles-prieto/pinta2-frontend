import { useState, useEffect } from 'react';
import { RegisterUserForm } from '../components/RegisterUserForm';
import { BodyContainer } from '../components/CanvasBoard/BodyContainer';
import { SocketProvider, useSocket } from '../hooks/useSocket';
import { SelectRoomForm } from '../components/SelectRoomForm';

const Homepage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const { socket, setUsername, joinedRoom } = useSocket();
  console.log('joinedRoom', joinedRoom)

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
    <div>
      {!isRegistered ? (
        <RegisterUserForm setIsRegistered={setIsRegistered} />
      ) : !joinedRoom ? (
        <SelectRoomForm />
      ) : (
        <BodyContainer />
      )}
    </div>
  );
};

export default () => (
  <SocketProvider>
    <Homepage />
  </SocketProvider>
);
