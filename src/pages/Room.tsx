import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { BodyContainer } from '../components/CanvasBoard/BodyContainer';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { useModal } from '../hooks/useModal';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useCustomToast } from '../hooks/useCustomToast';

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
  const { showToast } = useCustomToast();

  const displayConfirmMsg = () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres salirte de la partida?'
    );
    if (confirmed) {
      navigate('/', {
        state: {
          disconnectUser: true,
        },
        replace: true,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        displayConfirmMsg();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
        displayConfirmMsg();
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
    if (!socketRef.current && roomId && queryPw) {
      const URL_BACK = import.meta.env.VITE_BACK_URL;
      const newSocket = io(URL_BACK ?? 'http://localhost:4000');
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
        navigate('/home', {
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
      showToast({
        msg: 'Introduzca un nombre válido',
        options: { type: 'error' },
      });
      return;
    }

    setJoinedRoom(roomId ? Number(roomId) : 9999);
    setRoomPassword(queryPw ?? '');
    closeUsernameModal();
    socket?.emit('join room directly', {
      roomNumber: roomId,
      username: username.trim(),
    });
  };

  if (!socket || !roomId || (!queryPw && !hasInternalPw) || !joinedRoom) {
    return (
      <>
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
                  className='flex-shrink-0 px-2 py-1 text-sm text-black bg-teal-400 border-4 border-teal-400 rounded hover:bg-teal-300 hover:border-teal-300'
                  type='submit'
                >
                  Acceder
                </button>
                <button
                  className='flex-shrink-0 px-2 py-1 ml-2 text-sm text-black bg-teal-400 border-4 border-teal-400 rounded hover:bg-teal-300 hover:border-teal-300'
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
