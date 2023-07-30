import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { BodyContainer } from '../components/CanvasBoard/BodyContainer';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { useModal } from '../hooks/useModal';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const Room = () => {
  const [hasInternalPw, setHasInternalPw] = useState(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const [searchParams] = useSearchParams();
  const { roomId } = useParams();
  const {
    socket,
    joinedRoom,
    setJoinedRoom,
    setSocket,
    isRegistered,
    username,
    setUsername,
    setRoomPassword,
  } = useSocket();
  const navigate = useNavigate();
  const queryPw = searchParams.get('pw');
  const {
    RenderModal: UsernameModal,
    closeModal: closeUsernameModal,
    openModal: openUsernameModal,
  } = useModal();

  // Avoid back and forward mouse buttons. Also F5 reload
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        const confirmed = window.confirm(
          '¿Estás seguro de que quieres salirte de la partida?'
        );
        if (confirmed) {
          navigate('/', {
            state: {
              disconnectUser: true,
            },
          });
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
        const confirmed = window.confirm(
          '¿Estás seguro de que quieres salirte de la partida?'
        );
        if (confirmed) {
          navigate('/', {
            state: {
              disconnectUser: true,
            },
          });
        }
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // using a ref to avoid re-renders that would bug and create a second newSocket
    // (even when checking !socket in the if condition)
    // TODO: IMPORTANT Sanitize queryPw (query param) and roomId (param) to not send weird things to back
    if (!socketRef.current && roomId && queryPw) {
      const newSocket = io('http://localhost:4000');
      socketRef.current = newSocket;
      setSocket(newSocket);
      newSocket.emit('check room credentials', {
        roomNumber: roomId,
        roomPassword: queryPw,
      });
    }
  }, [socket, roomId, queryPw]);

  useEffect(() => {
    if (joinedRoom && !queryPw && socket && isRegistered) {
      setHasInternalPw(true);
    }
  }, [socket, joinedRoom, queryPw, isRegistered]);

  useEffect(() => {
    if ((!joinedRoom || !isRegistered) && !queryPw) {
      if (isRegistered && !joinedRoom) {
        navigate('/join-room', {
          state: {
            notRegistered: 'Introduzca las credenciales correctas',
            from: location.pathname,
          },
        });
      } else {
        navigate('/', {
          state: {
            notRegistered: 'Para poder acceder, escriba un nombre',
            from: location.pathname,
          },
        });
      }
    }
  }, [joinedRoom, queryPw, isRegistered]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      'check room credentials response',
      ({ message, success }: { success: boolean; message: string }) => {
        if (!success) {
          navigate('/', {
            state: {
              notRegistered: message,
              from: location.pathname,
            },
          });
        } else {
          openUsernameModal();
        }
      }
    );

    return () => {
      socket.off('check room credentials response');
    };
  }, [socket]);

  const onUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      // TODO: show toast, to indicate the user that has to put a username in the modal
      return;
    }

    setJoinedRoom(roomId ? Number(roomId) : 9999);
    setRoomPassword(queryPw ?? '');
    closeUsernameModal();
    socket?.emit('join room directly', {
      roomNumber: roomId,
      username,
    });
    // TODO: Display a toast to let know the user he joined the roomId
  };

  if (!socket || !roomId || (!queryPw && !hasInternalPw) || !joinedRoom) {
    return (
      <>
        {/* TODO: Change the loading with a skeleton of the finished game board */}
        <div>Loading...</div>
        <UsernameModal forbidClose>
          <>
            <div>Introduzca un nombre para unirse a la sala {roomId}</div>
            <form className='w-full max-w-sm' onSubmit={onUsernameSubmit}>
              <div className='flex items-center py-2 border-b border-teal-500'>
                <input
                  className='w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none'
                  type='text'
                  id='username'
                  name='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Enter a user name'
                  aria-label='User name'
                  autoFocus
                />
                <button
                  className='flex-shrink-0 px-2 py-1 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700'
                  type='submit'
                >
                  Acceder
                </button>
                <button
                  className='flex-shrink-0 px-2 py-1 ml-2 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700'
                  type='button'
                  onClick={() => navigate('/')}
                >
                  Volver atrás
                </button>
              </div>
            </form>
          </>
        </UsernameModal>
      </>
    );
  }

  return <BodyContainer />;
};

export default Room;
