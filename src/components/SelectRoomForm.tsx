import { FC, useRef, useState } from 'react';
import { FormContainer } from './FormContainer';
import { Copy, CopyOk, Eye, EyeOff } from './Icons';

type OptionsI = 'create' | 'join' | undefined;

export const SelectRoomForm: FC = () => {
  const [roomPassword, setRoomPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionsI>(undefined);
  const [roomDigits, setRoomDigits] = useState<(number | '')[]>(
    Array(4).fill('')
  );
  const [copied, setCopied] = useState(false);
  const digitsInputRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value) && value !== '') return;

      if (digitsInputRef.current[index + 1] && value !== '') {
        digitsInputRef.current[index + 1]?.focus();
      }

      const newDigits = [...roomDigits];
      newDigits[index] = value === '' ? '' : +value;
      setRoomDigits(newDigits);
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Check that i have 4 digits in the array, and it has a password of at least 1 character?
    console.log('roomPassword', roomPassword);
    console.log('digits', roomDigits);
    const roomNumber = +roomDigits.join('');
    console.log('roomNumber', roomNumber);
  };

  const copyToClipboard = async () => {
    if (copied) return;
    try {
      const roomNumber = +roomDigits.join('');
      navigator.clipboard.writeText(
        `Room: ${roomNumber}\nPassword: ${roomPassword}`
      );
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      console.log('failed to copy', e);
    }
  };

  const copyBtnStyles = copied ? 'bg-gray-500 text-white' : '';

  return (
    <>
      {!selectedOption ? (
        <>
          <button type='button' onClick={() => setSelectedOption('create')}>
            Create room
          </button>
          <button type='button' onClick={() => setSelectedOption('join')}>
            Join room
          </button>
        </>
      ) : selectedOption === 'create' ? (
        // TODO: Style back button and reuse input and button in separated components
        // TODO: Create button to auto generate the room number and to copy it to clipboard
        // maybe remove the title of form container ?
        <>
          <FormContainer title='Create a room' onSubmit={onSubmit}>
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
                <div className='flex items-center gap-4'>
                  <div className='relative'>
                    <input
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
                  <div className='border border-gray-500'>
                    {copied ? (
                      <CopyOk width={22} height={22} />
                    ) : (
                      <Copy width={40} height={40} />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    className={
                      copyBtnStyles +
                      ' text-sm w-[70%] mx-auto border mt-2 border-gray-500 rounded py-2 px-2 transition flex items-center justify-evenly'
                    }
                    type='button'
                    onClick={copyToClipboard}
                  >
                    <span>{copied ? 'Copied' : 'Copy to clipboard'}</span>
                    {copied ? (
                      <CopyOk width={22} height={22} />
                    ) : (
                      <Copy width={25} height={25} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className='mt-10 text-center'>
              <div className='w-full p-[2px] rounded-[10px] bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800'>
                <button
                  type='submit'
                  className='w-full py-3 overflow-hidden text-xl text-white bg-teal-600 hover:bg-teal-400 hover:text-black rounded-[8px]'
                >
                  Go to room
                </button>
              </div>
            </div>
          </FormContainer>
          <button type='button' onClick={() => setSelectedOption(undefined)}>
            Go back
          </button>
        </>
      ) : (
        <>
          <h1>Still to do</h1>
          <button type='button' onClick={() => setSelectedOption(undefined)}>
            Go back
          </button>
        </>
      )}
    </>
  );
};
