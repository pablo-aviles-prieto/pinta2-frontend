import { useEffect } from 'react';
import { RegisterUserForm } from '../components/RegisterUserForm';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { LOGO_COLORS_CLASSES } from '../utils/const';

const RegisterUser = () => {
  const { socket } = useSocket();
  const location = useLocation();
  const browsingState = location.state;

  useEffect(() => {
    if (browsingState) {
      console.log('browsingState', browsingState);
      // TODO: Display an error toast with the msg => browsingState.notRegistered
      // TODO: Check the from property in the state to redirect the user back => browsingState.from
      // (both coming from ProtectRegisteredRoute)
      // TODO: After settled to a state the url to be redirected, clear the location.state
      if (browsingState.disconnectUser) {
        socket?.disconnect();
        console.log(
          'Sigue los pasos para unirte/crear una sala y empezar a jugar!'
        );
        // TODO: Show a toast instead of a console.log
        // TODO:? Restart the disconnectUser prop to avoid possible problems
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
            <span style={{ fontFamily: 'inherit' }} className={LOGO_COLORS_CLASSES.i}>
              i
            </span>
            <span style={{ fontFamily: 'inherit' }} className={LOGO_COLORS_CLASSES.n}>
              n
            </span>
            <span style={{ fontFamily: 'inherit' }} className={LOGO_COLORS_CLASSES.t}>
              t
            </span>
            <span style={{ fontFamily: 'inherit' }} className={LOGO_COLORS_CLASSES.a}>
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
            <RegisterUserForm />
          </div>
        </div>
        <div className='absolute -right-[363px] -top-[65px]'>
          <img
            style={{ transform: 'scaleX(-1)' }}
            src='../../public/imgs/gecko-artist.webp'
            alt='Un reptil pintor'
          />
        </div>
      </div>
    </div >
  );
};

export default RegisterUser;
