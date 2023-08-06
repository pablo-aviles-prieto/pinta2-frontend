import { FC, useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import type { GameStateI, UserRoomI } from '../interfaces';
import { useGameData } from '../hooks/useGameData';
import { DEFAULT_TURN_DURATION } from '../utils/const';
import { useCustomToast } from '../hooks/useCustomToast';
import { Id } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RoomForm } from '../components/Styles/RoomForm';
import { BtnContainer } from '../components/Styles/BtnContainer';
import { Back, Join } from '../components/Icons';

interface JoinRoomResponse {
  success: boolean;
  message: string;
  room: number;
  newUsers?: UserRoomI[];
  isPlaying?: boolean;
  gameState?: GameStateI;
}

const TOOLTIP_WIDTH = 'w-[150px]';

const JoinRoom: FC = () => {
  const [joinRoomToastId, setJoinRoomToastId] = useState<Id | undefined>(
    undefined
  );
  const [roomDigits, setRoomDigits] = useState<(number | '')[]>(
    Array(4).fill('')
  );
  const digitsInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const { socket, setJoinedRoom, joinedRoom } = useSocket();
  const { updateToast } = useCustomToast();
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

        if (response.isPlaying) {
          setIsPlaying(response.isPlaying);
          socket.emit('update users not playing', {
            roomNumber: response.room,
          });
        }

        if (joinRoomToastId) {
          updateToast({
            toastId: joinRoomToastId,
            content: response.message,
            type: 'success',
          });
          setJoinRoomToastId(undefined);
        }

        navigate(`/room/${response.room}`, { replace: true });
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

  const tooltipClass = `absolute tooltip ${TOOLTIP_WIDTH} py-2 bg-orange-100 text-emerald-600 text-center 
    rounded-md shadow-md opacity-0 top-16 border border-emerald-400 group-hover:opacity-100 transform
     transition ease-in-out duration-200`;

  return (
    <div className='relative flex items-center justify-center h-[75vh]'>
      <div className='absolute -left-[650px] top-16 hover:sepia'>
        <img
          className='w-[1300px] h-[530px]'
          src='/imgs/woman-silhouette-paint.webp'
          alt='Utensilios para dibujar'
        />
      </div>
      <RoomForm
        title='Acceder a sala'
        containerWidth='md'
        roomDigits={roomDigits}
        digitsInputRef={digitsInputRef}
        setRoomDigits={setRoomDigits}
        passwordInputRef={passwordInputRef}
        setToastId={setJoinRoomToastId}
        isCreating={false}
      >
        <div className='flex items-center mt-10 gap-x-2'>
          <BtnContainer
            extraStyles='py-3 relative group h-[51px]'
            onClickHandler={() => navigate('/home')}
          >
            <>
              <span className={tooltipClass}>Volver atrás</span>
              <Back width={33} height={33} />
            </>
          </BtnContainer>
          <BtnContainer extraStyles='py-3 relative group h-[51px]' isSubmitBtn>
            <>
              <span className={tooltipClass}>Ir a la sala</span>
              <Join width={24} height={24} />
            </>
          </BtnContainer>
        </div>
      </RoomForm>
    </div>
  );
};

export default JoinRoom;
