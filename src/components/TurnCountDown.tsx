import { useState, useEffect, FC } from 'react';

interface PropsI {
  initialCount: number;
  onCountDownComplete?: () => void;
}

export const TurnCountDown: FC<PropsI> = ({
  initialCount,
  onCountDownComplete,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount((currentCount) => {
        if (currentCount - 1 <= 0) {
          // Countdown has completed
          onCountDownComplete && onCountDownComplete();
          return 0;
        } else {
          return currentCount - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <div>{count}</div>;
};
