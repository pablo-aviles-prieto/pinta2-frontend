import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { BodyContainer } from '../components/CanvasBoard/BodyContainer';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const Room = () => {
  const [searchParams] = useSearchParams();
  const { roomId } = useParams();
  const { socket, joinedRoom, setSocket } = useSocket();
  const pw = searchParams.get('pw');

  console.log('joinedRoom game', joinedRoom);
  console.log('socket game', socket);
  console.log('pw', pw);
  console.log('roomId', roomId);

  useEffect(() => {
    if (!socket) {
      if (roomId && pw) {
        // Check If the roomId exist and pw matches
        // Set a state to show a modal to register the user (send to a new event in the back like 'register directly user')
        // in that event, on the back, the user should be added to the users array, and into the room. Send a response event to this event
        // The Register user modal should be closed, when there is socket, roomId, pw and joinedRoom
        //////////////////////////////////
        // const newSocket = io('http://localhost:4000');
        // newSocket.emit('register', username);
        // setSocket(newSocket);
      }
    }
  }, [socket]);

  if (!socket || !roomId || !pw || !joinedRoom) {
    return <div>Loading...</div>;
  }

  return <BodyContainer />;
};

export default Room;
