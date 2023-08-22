import { useEffect, useState, useRef } from 'react';

interface PropsI {
  initTimerValue?: number;
  onCountDownComplete?: () => void;
}

export const useGenericTimer = ({
  onCountDownComplete,
  initTimerValue,
}: PropsI) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const [startCounter, setStartCounter] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  // callbackRef stores the latest callback variable values
  const callbackRef = useRef<typeof onCountDownComplete>();

  useEffect(() => {
    callbackRef.current = onCountDownComplete;
  }, [onCountDownComplete]);

  useEffect(() => {
    if (startCounter && count !== undefined) {
      initializeWorker(count);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [startCounter]);

  const initializeWorker = (initialCount: number) => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    workerRef.current = new Worker('/timer-worker.js');

    workerRef.current.onmessage = (e) => {
      const remainingTime = e.data;

      if (remainingTime <= 0) {
        callbackRef.current && callbackRef.current();
        setStartCounter(false);
      }

      setCount(remainingTime);
    };

    workerRef.current.postMessage({ startCounter, count: initialCount });
  };

  const handleCounterState = (boolean: boolean) => {
    if (boolean) {
      setCount(initTimerValue ?? 120); // Initialize count when starting
    }
    setStartCounter(boolean);
  };

  return {
    count,
    startCounter,
    setStartCounter,
    handleCounterState,
  };
};
