import { FC, useState } from 'react';
import { CreateNewRoom } from './CreateNewRoom';
import { JoinRoom } from './JoinRoom';

type OptionsI = 'create' | 'join' | undefined;

export const SelectRoomForm: FC = () => {
  const [selectedOption, setSelectedOption] = useState<OptionsI>(undefined);

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
        <CreateNewRoom setSelectedOption={setSelectedOption} />
      ) : (
        <JoinRoom setSelectedOption={setSelectedOption} />
      )}
    </>
  );
};
