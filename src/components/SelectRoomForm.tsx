import { FC, useState } from 'react';

export const SelectRoomForm: FC = () => {
  const [selectedOption, setSelectedOption] = useState(undefined);

  return (
    <>
      <button type='button'>Create room</button>
      <button type='button'>Join room</button>
    </>
  );
};
