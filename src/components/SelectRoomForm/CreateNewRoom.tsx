import { FC, useEffect, useRef, useState } from 'react';
import { FormContainer } from '../Styles/FormContainer';
import { Copy, CopyOk, Eye, EyeOff } from '../Icons';
import { ButtonBorderContainer } from '../Styles/ButtonBorderContainer';
import { useSocket } from '../../hooks/useSocket';
import type { UserRoomI } from '../../interfaces';
import { useGameData } from '../../hooks/useGameData';

type OptionsI = 'create' | 'join' | undefined;

interface CreateRoomResponse {
  success: boolean;
  message: string;
  room: number;
  roomUsers: UserRoomI[];
}

interface PropsI {
  setSelectedOption: React.Dispatch<React.SetStateAction<OptionsI>>;
}

export const CreateNewRoom: FC<PropsI> = ({ setSelectedOption }) => {
  const [roomPassword, setRoomPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [roomDigits, setRoomDigits] = useState<(number | '')[]>(
    Array(4).fill('')
  );
  const [copied, setCopied] = useState(false);
  const digitsInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const { socket, setJoinedRoom } = useSocket();
  const { setUserList } = useGameData();

  useEffect(() => {
    if (!socket) return;

    const handleCreateRoomResponse = (response: CreateRoomResponse) => {
      if (response.success) {
        console.log('response', response);
        setJoinedRoom(response.room);
        setUserList(response.roomUsers);

        // TODO: Clean inputs? (atm im using the roomDigits)
        // TODO: Redirect to the url of the room (room/[roomId])
      } else {
        console.log(response.message);
        // TODO: Send a toast with the response.message
      }
    };
    socket.on('create room response', handleCreateRoomResponse);

    return () => {
      socket.off('create room response', handleCreateRoomResponse);
    };
  }, [socket]);

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
    )
      return; // TODO: Send a toast to give some feedback
    const roomNumber = +roomDigits.join('');

    if (socket) {
      socket.emit('create room', { roomNumber, roomPassword });
    }
  };

  const copyToClipboard = async () => {
    if (copied) return;
    try {
      const roomNumber = +roomDigits.join('');
      navigator.clipboard.writeText(
        `Room: ${roomNumber}\nPassword: ${roomPassword.trim()}`
      );
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (e) {
      console.error('failed to copy data', e);
    }
  };

  const copyBtnStyles = copied ? 'bg-gray-500 text-white' : '';

  return (
    // TODO: Create button to auto generate the room number
    // maybe remove the title of form container ?
    <>
      <FormContainer
        title='Create a room'
        containerWidth='md'
        onSubmit={onSubmit}
      >
        <div className='space-y-6'>
          <div>
            <label className='text-xl' htmlFor='roomNumber'>
              Room Nº
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
                  onChange={handleInputChange(index)}
                  className='w-[55px] h-[55px] text-2xl rounded-full border outline-none text-center'
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
          </div>
          <div>
            <label className='text-xl' htmlFor='roomPassword'>
              Password
            </label>
            <div className='relative'>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={roomPassword}
                className='w-full px-4 py-3 text-sm border rounded-lg outline-none'
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
          <ButtonBorderContainer>
            <button
              className={`${copyBtnStyles} w-full mx-auto text-lg
                rounded-md bg-teal-400 py-2 transition flex items-center justify-evenly 
                hover:text-white hover:bg-teal-600`}
              type='button'
              onClick={copyToClipboard}
            >
              <span>{copied ? 'Copied' : 'Copy details'}</span>
              {copied ? (
                <CopyOk width={27} height={27} />
              ) : (
                <Copy width={27} height={27} />
              )}
            </button>
          </ButtonBorderContainer>
          <ButtonBorderContainer>
            <button
              type='submit'
              className='w-full py-2 overflow-hidden text-lg text-white bg-teal-600 rounded-md hover:bg-teal-400 hover:text-black'
            >
              Go to room
            </button>
          </ButtonBorderContainer>
        </div>
      </FormContainer>
      <button type='button' onClick={() => setSelectedOption(undefined)}>
        Go back
      </button>
    </>
  );
};
