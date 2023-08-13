import { FC, Fragment, useState } from 'react';
import { LOGO_COLORS_CLASSES } from '../../utils/const';
import { NavLink } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { ContactForm } from '../ContactForm';
import { useModal } from '../../hooks/useModal';

interface Props {
  children: JSX.Element;
}

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
    needSocket: true,
  }, // Visible when user has a socket connection stablished (only displays modal)
  { id: 'help', label: 'Ayuda', path: '/help', displayTooltip: true },
];

const ROOM_COLORS = [
  'text-orange-500',
  'text-pink-700',
  'text-lime-600',
  'text-blue-500',
];

const TOOLTIP_WIDTH = 'w-[400px]';

const Divider = () => {
  return <span className='mx-2 text-2xl text-teal-500'>|</span>;
};

export const Layout: FC<Props> = ({ children }) => {
  const [tooltipTab, setTooltipTab] = useState<'howTo' | 'rules'>('howTo');
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
          <div className='min-w-[175px]'>
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
                className={`text-[65px] absolute -top-[17px] left-[94px] transform -rotate-[18deg]
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
                if (option.needSocket && !socket) return;
                if (option.displayModal) {
                  return (
                    <Fragment key={option.id}>
                      <li>
                        <button
                          onClick={openModal}
                          className='text-lg text-neutral-600 hover:text-emerald-400'
                        >
                          {option.label}
                        </button>
                      </li>
                      {i !== NAV_OPTIONS.length - 1 && <Divider />}
                    </Fragment>
                  );
                }
                if (option.displayTooltip) {
                  return (
                    <Fragment key={option.id}>
                      <li>
                        <div className='relative text-lg cursor-help group text-neutral-600 hover:text-emerald-400'>
                          {option.label}
                          <div
                            className={`z-[2] absolute ${TOOLTIP_WIDTH} top-[28px] -left-[350px] ${
                              tooltipTab === 'howTo'
                                ? 'tooltip-help-howto'
                                : 'tooltip-help-rules'
                            } bg-orange-100 
                             text-emerald-600 text-center rounded-md shadow-md hidden border border-emerald-400 transform group-hover:block
                             transition ease-in-out duration-200`}
                          >
                            <div
                              className={`flex items-center justify-between mb-4 bg-orange-200 
                            rounded-t-md shadow-[inset_3px_3px_15px_rgba(0,0,0,0.15)]`}
                            >
                              <button
                                className={`${
                                  tooltipTab === 'howTo'
                                    ? 'rounded-tr-xl bg-orange-100 border-r border-emerald-400 cursor-default underline'
                                    : `bg-orange-200 border-b border-emerald-400 shadow-[inset_-2px_-3px_7px_rgba(0,0,0,0.1)]`
                                } w-[50%] py-1 rounded-tl-md`}
                                type='button'
                                onClick={() => setTooltipTab('howTo')}
                              >
                                ¿Cómo empezar?
                              </button>
                              <button
                                className={`${
                                  tooltipTab === 'rules'
                                    ? 'rounded-tl-xl bg-orange-100 border-l border-emerald-400 cursor-default underline'
                                    : `bg-orange-200 border-b border-emerald-400 shadow-[inset_2px_-3px_7px_rgba(0,0,0,0.1)]`
                                } w-[50%] py-1 rounded-tr-md`}
                                type='button'
                                onClick={() => setTooltipTab('rules')}
                              >
                                Reglas del juego
                              </button>
                            </div>
                            <div className='px-2 mb-4 text-base text-left'>
                              {tooltipTab === 'howTo' ? (
                                <ul>
                                  <li className='my-2'>
                                    - <span className='font-bold'>Acceda</span>{' '}
                                    con un{' '}
                                    <span className='font-bold'>nombre</span>{' '}
                                    (no hace falta registrarse)
                                  </li>
                                  <li className='my-2'>
                                    - <span className='font-bold'>Crea</span> o
                                    accede a una{' '}
                                    <span className='font-bold'>sala</span>
                                  </li>
                                  <li className='my-2'>
                                    - La sala tiene que tener{' '}
                                    <span className='font-bold'>4 dígitos</span>{' '}
                                    y una{' '}
                                    <span className='font-bold'>
                                      contraseña
                                    </span>
                                  </li>
                                  <li className='my-2'>
                                    - Invita a tus amigos pasándoles el{' '}
                                    <span className='font-bold'>enlace</span> o
                                    los{' '}
                                    <span className='font-bold'>detalles</span>{' '}
                                    de la{' '}
                                    <span className='font-bold'>sala</span>
                                  </li>
                                </ul>
                              ) : (
                                <ul>
                                  <li className='my-2'>
                                    - Es necesario ser un{' '}
                                    <span className='font-bold'>mínimo</span> de{' '}
                                    <span className='font-bold'>
                                      3 jugadores
                                    </span>
                                  </li>
                                  <li className='my-2'>
                                    - Se puede{' '}
                                    <span className='font-bold'>
                                      configurar
                                    </span>
                                    , la{' '}
                                    <span className='font-bold'>categoría</span>{' '}
                                    de{' '}
                                    <span className='font-bold'>palabras</span>{' '}
                                    y el{' '}
                                    <span className='font-bold'>
                                      tiempo de ronda
                                    </span>
                                  </li>
                                  <li className='my-2'>
                                    - Cada jugador que acierta,{' '}
                                    <span className='font-bold'>recibe</span>{' '}
                                    los{' '}
                                    <span className='font-bold'>
                                      segundos restantes
                                    </span>{' '}
                                    como puntuación y el{' '}
                                    <span className='font-bold'>
                                      pintor recibe 10 puntos
                                    </span>
                                  </li>
                                  <li className='my-2'>
                                    - Tras cada{' '}
                                    <span className='font-bold'>acierto</span>,
                                    el tiempo del turno se{' '}
                                    <span className='font-bold'>
                                      reduce acorde al % de tiempo restante
                                    </span>
                                  </li>
                                  <li className='my-2'>
                                    - <span className='font-bold'>Gana</span> el
                                    jugador que tras finalizar{' '}
                                    <span className='font-bold'>2 rondas</span>{' '}
                                    completas, tenga{' '}
                                    <span className='font-bold'>
                                      más puntuación
                                    </span>
                                  </li>
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
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
                            isActive
                              ? 'text-emerald-500 hover:text-emerald-500'
                              : 'text-neutral-600'
                          } 
                        text-lg hover:text-emerald-400`
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
        <ContactForm closeModal={closeModal} />
      </RenderModal>
    </div>
  );
};
