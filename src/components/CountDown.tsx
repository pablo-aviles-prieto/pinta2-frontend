import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Pencil } from './Icons';

export const CountDown = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <CountdownCircleTimer
        isPlaying
        size={300}
        strokeWidth={35}
        colors={['#ff7f51', '#ce4257', '#720026', '#4f000b']}
        colorsTime={[3, 2, 1, 0]}
        duration={3}
        onComplete={(totalElapsedTime) => {
          console.log('totalElapsedTime', totalElapsedTime);
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
