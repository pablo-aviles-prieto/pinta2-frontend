import { useEffect, useRef, useState } from 'react';
import { useGameData } from './useGameData';

interface PropsI {
  onCountDownComplete?: () => void;
}

export const useTurnCounter = ({ onCountDownComplete }: PropsI) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const [startCounter, setStartCounter] = useState(false);
  const [newCount, setNewCount] = useState<number | undefined>(undefined);
  const { turnDuration } = useGameData();
  const workerRef = useRef<Worker>();
  useEffect(() => {
    if (!turnDuration) return;
    setCount(turnDuration);
  }, [turnDuration]);

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

  useEffect(() => {
    if (newCount !== undefined) {
      setCount(newCount);
      initializeWorker(newCount);
      setTimeout(() => setNewCount(undefined), 1000);
    }
  }, [newCount]);

  const initializeWorker = (count: number) => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    workerRef.current = new Worker('/timer-worker.js');
    workerRef.current.postMessage({ startCounter, count });

    workerRef.current.onmessage = (e) => {
      const remainingTime = e.data;

      if (remainingTime <= 0) {
        onCountDownComplete && onCountDownComplete();
        setStartCounter(false);
      }

      setCount(remainingTime);
    };
  };

  const handleCounterState = (boolean: boolean) => {
    setStartCounter(boolean);
    if (boolean && turnDuration !== undefined) {
      setCount(turnDuration || 120);
      initializeWorker(turnDuration || 120);
    }
  };

  const resetCounterState = (newCount: number) => {
    setNewCount(newCount);
  };

  return {
    count,
    startCounter,
    setStartCounter,
    handleCounterState,
    resetCounterState,
  };
};
