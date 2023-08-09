import { FC, Fragment } from 'react';
import { LOGO_COLORS_CLASSES } from '../../utils/const';
import { NavLink } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { ContactForm } from '../ContactForm';
import { useModal } from '../../hooks/useModal';

interface Props {
  children: JSX.Element;
}

// TODO: Edit contact and help route since it should be displayed on a modal
// and on a tooltip instead of redirecting to a path
const NAV_OPTIONS = [
  {
    id: 'home',
    label: 'Inicio',
    path: '/',
    altPath: '/home',
    protectWhilePlaying: true,
  }, // Visible when user not playing
  {
    id: 'create',
    label: 'Crear sala',
    path: '/create-room',
    protectRegistered: true,
    protectWhilePlaying: true,
  }, // Visible when user registered and not playing
  {
    id: 'join',
    label: 'Unirse',
    path: '/join-room',
    protectRegistered: true,
    protectWhilePlaying: true,
  }, // Visible when user registered and not playing
  {
    id: 'disconnect',
    label: 'Desconectar',
    path: '/',
    state: {
      disconnectUser: true,
      from: location.pathname,
    },
    showOnPlaying: true,
  }, // Only visible while playing
  {
    id: 'contact',
    label: 'Contactar',
    path: '/contact',
    displayModal: true,
  },
  { id: 'help', label: 'Ayuda', path: '/help' },
];

const ROOM_COLORS = [
  'text-orange-500',
  'text-pink-700',
  'text-lime-600',
  'text-blue-500',
];

const Divider = () => {
  return <span className='mx-2 text-2xl text-teal-500 text-'>|</span>;
};

// TODO: IMPORTANT The 'Contacto' option (should be a modal sending a mail in the form
// like I did on the portfolio)
// TODO: IMPORTANT The 'Ayuda' option should be a modal aswell, so it can be opened while gaming
// (maybe it should be displayed on hover, and no need to click!!!)
export const Layout: FC<Props> = ({ children }) => {
  const { socket, joinedRoom } = useSocket();
  const { RenderModal, closeModal, openModal } = useModal();

  return (
    <div
      className='min-h-[99vh] xl:min-h-[100vh]'
      style={{
        backgroundImage: `url('/imgs/bg-cartoons-light.webp')`,
      }}
    >
      <div
        className='bg-gradient-to-tl from-amber-50 via-orange-50 to-amber-50
        w-full h-[50px] shadow-lg shadow-neutral-200'
      >
        <div
          className='flex h-full items-center max-w-[1280px] m-auto 
        justify-between px-16 xl:px-0'
        >
          <div>
            <h1
              style={{ fontFamily: 'Finger Paint' }}
              className='text-[35px] relative'
            >
              <span
                style={{ fontFamily: 'inherit' }}
                className={`text-[45px] ${LOGO_COLORS_CLASSES.p}`}
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
                className={`text-[65px] absolute -top-[16px] -right-[22px] transform -rotate-[18deg]
                 ${LOGO_COLORS_CLASSES['2']}`}
              >
                2
              </span>
            </h1>
          </div>
          {joinedRoom && (
            <p
              className='text-2xl italic text-emerald-600'
              style={{ fontFamily: 'Amaranth' }}
            >
              Sala:{' '}
              <span className='text-[30px]'>
                {joinedRoom
                  .toString()
                  .split('')
                  .map((char, i) => (
                    <span
                      key={i}
                      className={`${ROOM_COLORS[i]} mr-[1px]`}
                      style={{ fontFamily: 'Finger Paint' }}
                    >
                      {char}
                    </span>
                  ))}
              </span>
            </p>
          )}
          <div>
            <ul className='flex items-center'>
              {NAV_OPTIONS.map((option, i) => {
                if (option.protectRegistered && !socket) return;
                if (option.protectWhilePlaying && joinedRoom) return;
                if (option.showOnPlaying && !joinedRoom) return;
                if (option.displayModal) {
                  return (
                    <Fragment key={option.id}>
                      <li>
                        <button
                          onClick={openModal}
                          className='text-lg text-neutral-600'
                        >
                          {option.label}
                        </button>
                      </li>
                      {i !== NAV_OPTIONS.length - 1 && <Divider />}
                    </Fragment>
                  );
                }
                return (
                  <Fragment key={option.id}>
                    <li>
                      <NavLink
                        className={({ isActive }) =>
                          `${
                            isActive ? 'text-emerald-500' : 'text-neutral-600'
                          } 
                        text-lg`
                        }
                        to={
                          option.altPath && socket
                            ? option.altPath
                            : option.path
                        }
                        state={option.state ?? {}}
                      >
                        {option.label}
                      </NavLink>
                    </li>
                    {i !== NAV_OPTIONS.length - 1 && <Divider />}
                  </Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className='max-w-[1280px] m-auto mt-3'>{children}</div>
      <RenderModal
        extraClasses='bg-gradient-to-tl
         from-amber-50 via-orange-50 to-amber-100'
      >
        <ContactForm />
      </RenderModal>
    </div>
  );
};
