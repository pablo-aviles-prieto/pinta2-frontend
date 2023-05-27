import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export const CountDown = () => {
  return (
    <CountdownCircleTimer
      isPlaying
      size={120}
      strokeWidth={6}
      colors='#218380'
      duration={3}
      initialRemainingTime={5}
      onComplete={(totalElapsedTime) => {
        console.log('totalElapsedTime', totalElapsedTime);
      }}
    >
      {({ elapsedTime, color }) => <span style={{ color }}>{elapsedTime}</span>}
    </CountdownCircleTimer>
  );
};
