import { useNavigate } from 'react-router-dom';
import { BtnContainer } from '../components/Styles/BtnContainer';
import { useState } from 'react';

const Homepage = () => {
  const [btnHovered, setBtnHovered] =
    useState<'create' | 'join' | undefined>(undefined)
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center h-[75vh]'>
      <div
        className='border border-emerald-400 relative w-[550px] h-[450px] bg-gradient-to-tl
         from-amber-50 via-orange-50 to-amber-50'
        style={{ borderRadius: '49% 51% 51% 49% / 100% 0% 100% 0%' }}
      >
        <h1
          className='absolute right-[22px] top-[150px] font-bold text-[25px] z-[1]'
          style={{ fontFamily: 'Edu SA Beginner' }}>
          Crea o accede a una sala para empezar a jugar
        </h1>
        <div className='absolute top-[205px] left-[95px] flex gap-10 z-[1]'>
          <BtnContainer
            onClickHandler={() => navigate('/create-room')}
            extraStyles='w-[160px] py-3'
            onMouseEnter={() => setBtnHovered('create')}
            onMouseLeave={() => setBtnHovered(undefined)}
          >
            <span className='text-xl'>
              Crear sala
            </span>
          </BtnContainer>
          <BtnContainer
            onClickHandler={() => navigate('/join-room')}
            extraStyles='w-[170px] py-3'
            onMouseEnter={() => setBtnHovered('join')}
            onMouseLeave={() => setBtnHovered(undefined)}
          >
            <span className='text-xl'>
              Entrar a sala
            </span>
          </BtnContainer>
        </div>
        <div className='absolute -left-[350px] -top-[30px] w-[500px]'>
          <img
            className={`transition-all duration-500 ${btnHovered === 'create' ? '' : 'grayscale'}`}
            src='../../public/imgs/gears.webp'
            alt='Engranajes'
          />
        </div>
        <div className='absolute -right-[330px] top-[10px] w-[400px]'>
          <img
            className={`transition-all duration-500 ${btnHovered === 'join' ? '' : 'grayscale'}`}
            src='../../public/imgs/door-cartoon.webp'
            alt='Puerta'
          />
        </div>
        <div className='absolute -right-[170px] top-[188px] w-[180px]'>
          <img
            className={`transition-all duration-500 ${btnHovered === 'join' ? '' : 'grayscale'}`}
            src='../../public/imgs/canvas.webp'
            alt='Lienzo'
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
