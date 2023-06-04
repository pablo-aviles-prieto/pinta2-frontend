import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Pencil } from './Icons';
import { FC } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useGameData } from '../hooks/useGameData';

interface PropsI {
  setShowCountdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PreTurnCountDown: FC<PropsI> = ({ setShowCountdown }) => {
  const { socket, joinedRoom } = useSocket();
  const { gameState } = useGameData();

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <CountdownCircleTimer
        isPlaying
        size={300}
        strokeWidth={35}
        colors={['#ff7f51', '#ce4257', '#720026', '#4f000b']}
        colorsTime={[3, 2, 1, 0]}
        duration={3}
        onComplete={() => {
          if (socket?.id === gameState.drawer?.id) {
            socket?.emit('starting turn', { roomNumber: joinedRoom });
          }
          setShowCountdown(false);
        }}
      >
        {({ remainingTime, color }) => (
          <span
            style={{ color, fontFamily: 'Finger Paint' }}
            className={
              remainingTime === 0 ? 'text-9xl' : 'text-[190px] h-[315px]'
            }
          >
            {remainingTime === 0 ? (
              <Pencil width={150} height={150} />
            ) : (
              remainingTime
            )}
          </span>
        )}
      </CountdownCircleTimer>
    </div>
  );
};