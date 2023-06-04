// import { useEffect, useState } from 'react';
// import { useGameData } from './useGameData';

// interface PropsI {
//   onCountDownComplete?: () => void;
// }

// export const useTurnCounter = ({ onCountDownComplete }: PropsI) => {
//   const [count, setCount] = useState<number | undefined>(undefined);
//   const [startCounter, setStartCounter] = useState(false);
//   const { turnDuration } = useGameData();

//   const handleCounterState = (boolean: boolean) => {
//     setStartCounter(boolean);
//     setCount(turnDuration || 120); // turnDuration is already in seconds
//   };

//   useEffect(() => {
//     if (!turnDuration) return;
//     setCount(turnDuration);
//   }, [turnDuration]);

//   useEffect(() => {
//     if (!startCounter || count === undefined) return;

//     const timerId = setInterval(() => {
//       setCount((currentCount) => {
//         if (currentCount === undefined) return undefined;
//         if (currentCount - 1 <= 0) {
//           // Countdown has completed
//           onCountDownComplete && onCountDownComplete();
//           setStartCounter(false);
//           return 0;
//         } else {
//           return currentCount - 1;
//         }
//       });
//     }, 1000);

//     return () => {
//       clearInterval(timerId);
//     };
//   }, [count, startCounter]);

//   return { count, startCounter, setStartCounter, handleCounterState };
// };

import { useEffect, useState } from 'react';
import { useGameData } from './useGameData';

interface PropsI {
  onCountDownComplete?: () => void;
}

export const useTurnCounter = ({ onCountDownComplete }: PropsI) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const [startCounter, setStartCounter] = useState(false);
  const { turnDuration } = useGameData();

  const handleCounterState = (boolean: boolean) => {
    setStartCounter(boolean);
    setCount(turnDuration || 120); // turnDuration is already in seconds
  };

  useEffect(() => {
    if (!turnDuration) return;
    setCount(turnDuration);
  }, [turnDuration]);

  useEffect(() => {
    let worker: Worker;

    if (startCounter && count !== undefined) {
      // Initialize the worker with the current count
      worker = new Worker('timer-worker.js');
      worker.postMessage({ startCounter, count });

      worker.onmessage = (e) => {
        const remainingTime = e.data;

        if (remainingTime <= 0) {
          // Countdown has completed
          onCountDownComplete && onCountDownComplete();
          setStartCounter(false);
        }

        setCount(remainingTime);
      };
    }

    return () => {
      // Clean up the worker when the component is unmounted
      if (worker) {
        worker.terminate();
      }
    };
  }, [count, startCounter]);

  return { count, startCounter, setStartCounter, handleCounterState };
};
