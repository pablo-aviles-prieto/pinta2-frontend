import { FC, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  msg: string | undefined;
}

export const GuessedWord: FC<Props> = ({ msg }) => {
  const partyTrumpetAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let trumpetAudioTimeout: number;
    if (partyTrumpetAudioRef.current) {
      partyTrumpetAudioRef.current.volume = 0.1;
      trumpetAudioTimeout = setTimeout(
        () => partyTrumpetAudioRef.current?.play(),
        200
      );
    }
    const displayLeftConfetti = (side: 'left' | 'right') => {
      confetti({
        particleCount: 100,
        angle: side === 'left' ? 60 : 120,
        spread: 70,
        origin: { x: side === 'left' ? 0.1 : 0.9, y: 0.8 },
      });
    };
    const timeoutLeft1 = setTimeout(() => displayLeftConfetti('left'), 200);
    const timeoutRight1 = setTimeout(() => displayLeftConfetti('right'), 200);
    const timeoutLeft2 = setTimeout(() => displayLeftConfetti('left'), 1300);
    const timeoutRight2 = setTimeout(() => displayLeftConfetti('right'), 1300);

    return () => {
      clearTimeout(trumpetAudioTimeout);
      clearTimeout(timeoutLeft1);
      clearTimeout(timeoutRight1);
      clearTimeout(timeoutLeft2);
      clearTimeout(timeoutRight2);
    };
  }, []);

  return (
    <>
      <audio
        ref={partyTrumpetAudioRef}
        src='/audios/trumpet-party.mp3'
        preload='auto'
      ></audio>
      <div className='fixed inset-0 flex items-center justify-center zoomInOut'>
        <p
          className='text-8xl text-emerald-400 stroked-text'
          style={{ fontFamily: 'Amaranth' }}
        >
          {msg || `Felicidades, acertaste`}
        </p>
      </div>
    </>
  );
};
