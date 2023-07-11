import { FC, useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import type { GameStateI, UserRoomI } from '../../interfaces';
import { useGameData } from '../../hooks/useGameData';
import { DEFAULT_TURN_DURATION } from '../../utils/const';

type OptionsI = 'create' | 'join' | undefined;

interface PropsI {
  setSelectedOption: React.Dispatch<React.SetStateAction<OptionsI>>;
}

// TODO: Check if I can marge this interface iwht CreateRoomResponse interface in CreateNewRoom.tsx
interface JoinRoomResponse {
  success: boolean;
  message: string;
  room: number;
  newUsers?: UserRoomI[];
  isPlaying?: boolean;
  gameState?: GameStateI;
}

export const JoinRoom: FC<PropsI> = ({ setSelectedOption }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const { socket, setJoinedRoom } = useSocket();
  const { setUserList, setGameState, setIsPlaying, setTurnDuration } =
    useGameData();

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

        // TODO: Clear inputs?
        // TODO: Redirect to the url of the room (room/[roomId])
      } else {
        console.log(response.message);
        // TODO: Send a toast with the response.message
      }
    };
    socket.on('join room response', handleJoinRoomResponse);

    return () => {
      socket.off('join room response', handleJoinRoomResponse);
    };
  }, [socket]);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Check that inputs are correctly filled
    if (
      !roomPassword.trim()
      // roomDigits.some((digit) => digit === '' || isNaN(digit))
    )
      return; // TODO: Send a toast to give some feedback

    if (socket) {
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
      <button
        className='mt-6'
        type='button'
        onClick={() => setSelectedOption(undefined)}
      >
        Go back
      </button>
    </>
  );
};
