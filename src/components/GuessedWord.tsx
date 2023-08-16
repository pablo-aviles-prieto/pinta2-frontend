import { FC, useEffect, useRef } from 'react';

interface Props {
  msg: string | undefined;
}

export const GuessedWord: FC<Props> = ({ msg }) => {
  const fireworksAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (fireworksAudioRef.current) {
      fireworksAudioRef.current.volume = 0.5;
      fireworksAudioRef.current.play();
    }
  }, []);

  return (
    <>
      <audio
        ref={fireworksAudioRef}
        src='/audios/fireworks.mp3'
        preload='auto'
      ></audio>
      <div className='fixed inset-0 flex items-center justify-center'>
        <p
          className='text-8xl text-emerald-400 stroked-text'
          style={{ fontFamily: 'Amaranth' }}
        >
          {msg || `Felicidades, acertaste`}
        </p>
      </div>
      <div className='fixed -top-[450px] w-[100%] left-0'>
        <img
          className='w-[100%] opacity-30'
          src='/gifs/fireworks1.gif'
          alt='Fireworks gif'
        />
      </div>
    </>
  );
};
