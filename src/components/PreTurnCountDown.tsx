import { FC } from 'react';

interface PropsI {
  preTurnCount: number | undefined;
}

export const PreTurnCountDown: FC<PropsI> = ({ preTurnCount }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <span
        style={{ fontFamily: 'Finger Paint' }}
        className={`${
          preTurnCount === 3
            ? 'text-orange-800'
            : preTurnCount === 2
            ? 'text-yellow-700'
            : preTurnCount === 1
            ? 'text-yellow-400'
            : ''
        } text-[350px]`}
      >
        {preTurnCount}
      </span>
    </div>
  );
};
