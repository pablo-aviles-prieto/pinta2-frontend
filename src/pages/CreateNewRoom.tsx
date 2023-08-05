import { FC, useEffect, useRef, useState } from 'react';
import { FormContainer } from '../components/Styles/FormContainer';
import { Back, Copy, CopyOk, Eye, EyeOff, Join } from '../components/Icons';
import { useSocket } from '../hooks/useSocket';
import type { UserRoomI } from '../interfaces';
import { useGameData } from '../hooks/useGameData';
import { useCustomToast } from '../hooks/useCustomToast';
import { Id } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '../utils';
import { BtnContainer } from '../components/Styles/BtnContainer';

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
  const [showPassword, setShowPassword] = useState(false);
  const [roomDigits, setRoomDigits] = useState<(number | '')[]>(
    Array(4).fill('')
  );
  const [copied, setCopied] = useState(false);
  const [createRoomToastId, setCreateRoomToastId] = useState<Id | undefined>(
    undefined
  );
  const digitsInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const { socket, setJoinedRoom, roomPassword, setRoomPassword } = useSocket();
  const { setUserList } = useGameData();
  const { showToast, showLoadingToast, updateToast } = useCustomToast();
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

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value) && value !== '') return;

      if (digitsInputRef.current[index + 1] && value !== '') {
        digitsInputRef.current[index + 1]?.focus();
      }

      // Focusing the password input when typed in the last digit input
      if (
        digitsInputRef.current.length - 1 === index &&
        passwordInputRef.current
      ) {
        passwordInputRef.current.focus();
      }

      const newDigits = [...roomDigits];
      newDigits[index] = value === '' ? '' : +value;
      setRoomDigits(newDigits);
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !roomPassword.trim() ||
      roomDigits.some((digit) => digit === '' || isNaN(digit))
    ) {
      showToast({
        msg: 'Por favor, rellene todos los datos',
        options: { type: 'error' },
      });
      return;
    }

    const roomNumber = +roomDigits.join('');

    if (socket) {
      const createRoomToast = showLoadingToast({ msg: 'Creando sala...' });
      setCreateRoomToastId(createRoomToast);

      socket.emit('create room', { roomNumber, roomPassword });
    }
  };

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
      <FormContainer title='Crear sala' containerWidth='md' onSubmit={onSubmit}>
        <div className='space-y-6'>
          <div>
            <label className='text-xl' htmlFor='roomNumber'>
              Número de la sala
            </label>
            <div className='flex justify-between'>
              {roomDigits.map((digit, index) => (
                <input
                  ref={(el) => (digitsInputRef.current[index] = el)} // add ref to each input
                  aria-label='Room number'
                  key={index}
                  autoComplete='off'
                  type='text'
                  pattern='\d*'
                  name='roomNumber'
                  autoFocus={index === 0}
                  maxLength={1}
                  value={digit}
                  onInput={handleInputChange(index)}
                  className='w-[55px] h-[55px] text-2xl rounded-full border border-emerald-600
                   text-center outline-none focus-visible:border-emerald-300'
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
          </div>
          <div>
            <label className='text-xl' htmlFor='roomPassword'>
              Contraseña
            </label>
            <div className='relative'>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                placeholder='Contraseña...'
                value={roomPassword}
                className='w-full px-4 py-3 text-sm border rounded-lg outline-none border-emerald-600 focus-visible:border-emerald-300'
                name='roomPassword'
                onChange={(e) => setRoomPassword(e.target.value)}
              />
              {showPassword ? (
                <EyeOff
                  className='absolute text-teal-600 transform -translate-y-1/2 cursor-pointer right-2 top-1/2'
                  width={30}
                  height={30}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <Eye
                  className='absolute text-teal-600 transform -translate-y-1/2 cursor-pointer right-2 top-1/2'
                  width={30}
                  height={30}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
          </div>
        </div>
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
      </FormContainer>
    </div>
  );
};

export default CreateNewRoom;
