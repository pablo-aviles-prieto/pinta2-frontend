import { FC, useState } from 'react';
import { FormContainer } from './FormContainer';

type OptionsI = 'create' | 'join' | undefined;

export const SelectRoomForm: FC = () => {
  const [roomPassword, setRoomPassword] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<OptionsI>(undefined);
  const [roomDigits, setRoomDigits] = useState<(number | '')[]>(
    Array(4).fill('')
  );

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value) && value !== '') return;

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
            <div className='space-y-4'>
              <div>
                <label htmlFor='roomNumber'>Room Nº</label>
                <div className='flex justify-between'>
                  {roomDigits.map((digit, index) => (
                    <input
                      key={index}
                      type='text'
                      pattern='\d*'
                      id='roomNumber'
                      name='roomNumber'
                      maxLength={1}
                      value={digit}
                      onChange={handleInputChange(index)}
                      className='w-[50px] h-[50px] pl-4 rounded-full text-xl border outline-none'
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor='roomPassword'>Password</label>
                <input
                  type='password'
                  placeholder='Password'
                  value={roomPassword}
                  className='block w-full px-4 py-3 text-sm border rounded-lg outline-none'
                  id='roomPassword'
                  name='roomPassword'
                  onChange={(e) => setRoomPassword(e.target.value)}
                />
              </div>
            </div>
            <div className='mt-6 text-center'>
              <button
                type='submit'
                className='w-64 py-3 text-xl text-white bg-teal-600 rounded-2xl'
              >
                Register room
              </button>
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
