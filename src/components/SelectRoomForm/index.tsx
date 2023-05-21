import { FC, useState } from 'react';
import { CreateNewRoom } from './CreateNewRoom';

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
