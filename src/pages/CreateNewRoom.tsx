import { FC, useEffect, useRef, useState } from 'react';
import { Back, Copy, CopyOk, Join } from '../components/Icons';
import { useSocket } from '../hooks/useSocket';
import type { UserRoomI } from '../interfaces';
import { useGameData } from '../hooks/useGameData';
import { useCustomToast } from '../hooks/useCustomToast';
import { Id } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '../utils';
import { BtnContainer } from '../components/Styles/BtnContainer';
import { RoomForm } from '../components/Styles/RoomForm';

interface CreateRoomResponse {
  success: boolean;
  message: string;
  room: number;
  roomUsers: UserRoomI[];
}

const TOOLTIP_WIDTH = 'w-[150px]';

// TODO: IMPORTANT sanitize the data of the password (max characts (10?) and some regex to not use any white space
// and dont use any special character, just normal chars???)
// TODO: IMPORTANT Test if the users should and can use special characters on the password field
const CreateNewRoom: FC = () => {
  const [roomDigits, setRoomDigits] = useState<(number | '')[]>(
    Array(4).fill('')
  );
  const [copied, setCopied] = useState(false);
  const [createRoomToastId, setCreateRoomToastId] = useState<Id | undefined>(
    undefined
  );
  const digitsInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const { socket, setJoinedRoom, roomPassword } = useSocket();
  const { setUserList } = useGameData();
  const { updateToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleCreateRoomResponse = (response: CreateRoomResponse) => {
      if (response.success) {
        setJoinedRoom(response.room);
        setUserList(response.roomUsers);
        if (createRoomToastId) {
          updateToast({
            toastId: createRoomToastId,
            content: response.message,
            type: 'success',
          });
          setCreateRoomToastId(undefined);
        }
        navigate(`/room/${response.room}`, {
          replace: true,
        });
      } else {
        if (createRoomToastId) {
          updateToast({
            toastId: createRoomToastId,
            content: response.message,
            type: 'error',
          });
          setCreateRoomToastId(undefined);
        }
      }
    };
    socket.on('create room response', handleCreateRoomResponse);

    return () => {
      socket.off('create room response', handleCreateRoomResponse);
    };
  }, [socket, createRoomToastId]);

  const tooltipClass = `absolute tooltip ${TOOLTIP_WIDTH} py-2 bg-orange-100 text-emerald-600 text-center 
  rounded-md shadow-md opacity-0 top-16 border border-emerald-400 group-hover:opacity-100 transform
   transition ease-in-out duration-200`;

  return (
    // TODO: Create button to auto generate the room number
    <div className='flex items-center justify-center h-[75vh]'>
      <div className='absolute top-7'>
        <img
          className='w-[700px] h-[830px]'
          src='/imgs/bground-create-room.webp'
          alt='Utensilios para dibujar'
        />
      </div>
      <RoomForm
        title='Crear sala'
        containerWidth='md'
        roomDigits={roomDigits}
        digitsInputRef={digitsInputRef}
        setRoomDigits={setRoomDigits}
        passwordInputRef={passwordInputRef}
        setToastId={setCreateRoomToastId}
        isCreating
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
          <BtnContainer
            extraStyles='py-3 relative group h-[51px]'
            onClickHandler={() =>
              copyToClipboard({
                isCopied: copied,
                setIsCopied: setCopied,
                roomNumber: +roomDigits.join(''),
                roomPassword,
              })
            }
          >
            <>
              <span className={tooltipClass}>
                {copied ? 'Copiado!' : 'Copiar enlace'}
              </span>
              {copied ? (
                <CopyOk width={29} height={29} />
              ) : (
                <Copy width={29} height={29} />
              )}
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

export default CreateNewRoom;
