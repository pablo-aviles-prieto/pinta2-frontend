import { FC, useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import type { GameStateI, UserRoomI } from '../interfaces';
import { useGameData } from '../hooks/useGameData';
import { DEFAULT_TURN_DURATION } from '../utils/const';
import { useCustomToast } from '../hooks/useCustomToast';
import { Id } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface JoinRoomResponse {
  success: boolean;
  message: string;
  room: number;
  newUsers?: UserRoomI[];
  isPlaying?: boolean;
  gameState?: GameStateI;
}

const JoinRoom: FC = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [joinRoomToastId, setJoinRoomToastId] = useState<Id | undefined>(
    undefined
  );
  const { socket, setJoinedRoom, joinedRoom } = useSocket();
  const { showToast, showLoadingToast, updateToast } = useCustomToast();
  const { setUserList, setGameState, setIsPlaying, setTurnDuration } =
    useGameData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleJoinRoomResponse = (response: JoinRoomResponse) => {
      if (response.success) {
        // if the game started, set the turnDuration for future turns
        if (response.gameState && response.gameState.started) {
          setTurnDuration(
            response.gameState.turnDuration
              ? response.gameState.turnDuration / 1000
              : DEFAULT_TURN_DURATION
          );
        }
        setJoinedRoom(response.room);
        response.newUsers && setUserList(response.newUsers);
        response.gameState && setGameState(response.gameState);
        response.isPlaying && setIsPlaying(response.isPlaying);

        if (joinRoomToastId) {
          updateToast({
            toastId: joinRoomToastId,
            content: response.message,
            type: 'success',
          });
          setJoinRoomToastId(undefined);
        }

        navigate(`/room/${response.room}`);

        // TODO: Clear inputs?
      } else {
        if (joinRoomToastId) {
          updateToast({
            toastId: joinRoomToastId,
            content: response.message,
            type: 'error',
          });
          setJoinRoomToastId(undefined);
        }
      }
    };
    socket.on('join room response', handleJoinRoomResponse);

    return () => {
      socket.off('join room response', handleJoinRoomResponse);
    };
  }, [socket, joinRoomToastId, joinedRoom]);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Check that inputs are correctly filled
    if (
      !roomPassword.trim()
      // roomDigits.some((digit) => digit === '' || isNaN(digit))
    ) {
      showToast({
        msg: 'Por favor, rellene todos los datos',
        options: { type: 'error' },
      });
      return;
    }

    if (socket) {
      const joinRoomToast = showLoadingToast({
        msg: 'Accediendo a la sala...',
      });
      setJoinRoomToastId(joinRoomToast);
      socket.emit('join room', { roomNumber, roomPassword });
    }
  };

  return (
    <>
      <form className='w-full max-w-sm' onSubmit={joinRoom}>
        <div className='flex items-center py-2 border-b border-teal-500'>
          {/* TODO: Change to a digits input instead of this input text */}
          <input
            className='w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none'
            type='text'
            id='roomNumber'
            name='roomNumber'
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder='Enter the room number'
            aria-label='Room number'
          />
          <button
            className='flex-shrink-0 px-2 py-1 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700'
            type='submit'
          >
            Join room
          </button>
        </div>
        <div className='flex items-center py-2 border-b border-teal-500'>
          <input
            className='w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none'
            type='text'
            id='roomPassword'
            name='roomPassword'
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
            placeholder='Enter the room password'
            aria-label='Room password'
          />
          <button
            className='flex-shrink-0 px-2 py-1 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700'
            type='submit'
          >
            Join room
          </button>
        </div>
      </form>
      <button className='mt-6' type='button' onClick={() => navigate('/home')}>
        Go back
      </button>
    </>
  );
};

export default JoinRoom;
