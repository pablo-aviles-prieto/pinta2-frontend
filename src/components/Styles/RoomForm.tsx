import { FC, useState } from 'react';
import { FormContainer } from './FormContainer';
import { Eye, EyeOff } from '../Icons';
import { maxWidthClasses } from '../../utils/const';
import { useSocket } from '../../hooks/useSocket';
import { Id } from 'react-toastify';
import { useCustomToast } from '../../hooks/useCustomToast';

type Props = {
  title?: string;
  containerWidth?: keyof typeof maxWidthClasses;
  setToastId: React.Dispatch<React.SetStateAction<Id | undefined>>;
  roomDigits: (number | '')[];
  digitsInputRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  setRoomDigits: React.Dispatch<React.SetStateAction<(number | '')[]>>;
  passwordInputRef: React.MutableRefObject<HTMLInputElement | null>;
  isCreating: boolean; // creating or joining a room
  children: JSX.Element;
};

const MAX_ROOMPASSWORD_CHARS = 10;

export const RoomForm: FC<Props> = ({
  title,
  containerWidth,
  setToastId,
  roomDigits,
  digitsInputRef,
  setRoomDigits,
  passwordInputRef,
  isCreating,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { socket, roomPassword, setRoomPassword } = useSocket();
  const { showToast, showLoadingToast } = useCustomToast();

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
    if (roomPassword.length > MAX_ROOMPASSWORD_CHARS) {
      showToast({
        msg: `La contraseña no puede tener más de ${MAX_ROOMPASSWORD_CHARS} caracteres`,
        options: { type: 'error' },
      });
      return;
    }

    const roomNumber = +roomDigits.join('');

    if (socket) {
      const joinRoomToast = showLoadingToast({
        msg: 'Accediendo a la sala...',
      });
      setToastId(joinRoomToast);
      socket.emit(isCreating ? 'create room' : 'join room', {
        roomNumber,
        roomPassword,
      });
    }
  };

  return (
    <FormContainer
      title={title}
      containerWidth={containerWidth ?? 'sm'}
      onSubmit={onSubmit}
      isCreating={isCreating}
    >
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
      {children}
    </FormContainer>
  );
};
