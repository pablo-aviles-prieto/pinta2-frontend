import { FC } from 'react';

interface Props {
  msg: string | undefined;
}

// TODO: Set a beautiful img with the message
// TODO: Display a sound when displayed the message
export const GuessedWord: FC<Props> = ({ msg }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center zoomInOut'>
      <p className='text-7xl'>{msg || `Felicidades, acertaste`}</p>
    </div>
  );
};
