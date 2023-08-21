import { useEffect, useState } from 'react';

interface PropsI {
  initTimerValue?: number;
  onCountDownComplete?: () => void;
}

export const useGenericTimer = ({
  onCountDownComplete,
  initTimerValue,
}: PropsI) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const [timerValue, setTimerValue] = useState<number | undefined>(
    initTimerValue
  );
  const [startCounter, setStartCounter] = useState(false);

  const handleCounterState = (boolean: boolean) => {
    setStartCounter(boolean);
    setCount(timerValue ?? 120); // turnDuration is already in seconds
  };

  // TODO: IMPORTANT change the logic and use a useRef to avoid re-downloads
  // of the worker!
  useEffect(() => {
    let worker: Worker;

    if (startCounter && count !== undefined) {
      // Initialize the worker with the current count
      worker = new Worker('/timer-worker.js');
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

  return {
    count,
    startCounter,
    setTimerValue,
    setStartCounter,
    handleCounterState,
  };
};
