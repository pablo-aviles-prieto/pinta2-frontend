import { FC, useEffect, useState } from 'react';
import { RegisterUserForm } from '../components/RegisterUserForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { LOGO_COLORS_CLASSES } from '../utils/const';
import { useCustomToast } from '../hooks/useCustomToast';

const RegisterUser: FC = () => {
  const [redirectedURL, setRedirectedURL] = useState<string | undefined>(
    undefined
  );
  const { socket, setSocket } = useSocket();
  const location = useLocation();
  const { showToast } = useCustomToast();
  const navigate = useNavigate();
  const browsingState = location.state;

  useEffect(() => {
    if (browsingState) {
      if (browsingState.notRegistered) {
        showToast({
          msg: browsingState.notRegistered,
          options: { type: 'warning' },
        });
        setRedirectedURL(browsingState.from);
      }
      if (browsingState.disconnectUser) {
        setSocket(null);
        socket?.disconnect();
        showToast({
          msg: 'Sigue los pasos para unirte/crear una sala y empezar a jugar!',
          options: { type: 'warning' },
        });
        navigate(location.pathname, {
          state: { ...browsingState, disconnectUser: undefined },
          replace: true,
        });
      }
    }
  }, [browsingState]);

  return (
    <div className='flex items-center justify-center h-[75vh]'>
      <div
        className='border border-emerald-400 relative w-[550px] h-[450px] bg-gradient-to-tl
         from-amber-50 via-orange-50 to-amber-50'
        style={{ borderRadius: '49% 51% 51% 49% / 0% 100% 0% 100%' }}
      >
        <div className='absolute left-[90px] -top-[30px] w-[367px] h-[350px] z-[1]'>
          <h1
            style={{ fontFamily: 'Finger Paint' }}
            className='text-[120px] relative mb-8'
          >
            <span
              style={{ fontFamily: 'inherit' }}
              className={`text-[170px] ${LOGO_COLORS_CLASSES.p}`}
            >
              P
            </span>
            <span
              style={{ fontFamily: 'inherit' }}
              className={LOGO_COLORS_CLASSES.i}
            >
              i
            </span>
            <span
              style={{ fontFamily: 'inherit' }}
              className={LOGO_COLORS_CLASSES.n}
            >
              n
            </span>
            <span
              style={{ fontFamily: 'inherit' }}
              className={LOGO_COLORS_CLASSES.t}
            >
              t
            </span>
            <span
              style={{ fontFamily: 'inherit' }}
              className={LOGO_COLORS_CLASSES.a}
            >
              a
            </span>
            <span
              style={{ fontFamily: 'inherit' }}
              className={`text-[290px] absolute -top-[95px] -right-[120px] 
              transform -rotate-[15deg] ${LOGO_COLORS_CLASSES['2']}`}
            >
              2
            </span>
          </h1>
          <h3
            className='absolute top-[190px] left-[45px] text-[20px] font-sans font-bold'
            style={{ fontFamily: 'Edu SA Beginner' }}
          >
            ¡Da rienda suelta a tus habilidades!
          </h3>
          <div className='my-4'>
            <p
              className='text-[22px] italic'
              style={{ fontFamily: 'Amaranth' }}
            >
              Accede para crear o entrar en una sala
            </p>
            <RegisterUserForm
              redirectedURL={redirectedURL}
              browsingState={browsingState}
              setRedirectedURL={setRedirectedURL}
            />
          </div>
        </div>
        <div className='absolute -right-[363px] -top-[65px]'>
          <img
            style={{ transform: 'scaleX(-1)' }}
            src='/imgs/gecko-artist.webp'
            alt='Un reptil pintor'
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
