import { FC } from 'react';
import { LOGO_COLORS_CLASSES } from '../../utils/const';

interface Props {
  children: JSX.Element;
}

// TODO: The 'Contacto' option (should be a modal sending a mail in the form
// like I did on the portfolio)
export const Layout: FC<Props> = ({ children }) => {
  return (
    <div
      className='min-h-[99vh] xl:min-h-[100vh]'
      style={{
        backgroundImage: `url('../../../public/imgs/bg-cartoons-light.webp')`,
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
              <span style={{ fontFamily: 'inherit' }} className={LOGO_COLORS_CLASSES.a}>
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
          <div>Crear sala | Unirse | Contacto | Ayuda?</div>
        </div>
      </div>
      <div className='max-w-[1280px] m-auto mt-3'>{children}</div>
    </div>
  );
};
