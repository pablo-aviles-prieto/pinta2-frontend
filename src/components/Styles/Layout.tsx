import { FC } from 'react';

interface Props {
  children: JSX.Element;
}

// TODO: The 'Contacto' option (should be a modal sending a mail in the form
// like I did on the portfolio)
export const Layout: FC<Props> = ({ children }) => {
  return (
    // TODO: IMPORTANT Change the 100vh in case that the width of the user is less than 1280px, 
    // since when the bottom scrollbar appears, the vertical appears aswell since is not 100vh
    <div
      className='min-h-[100vh]'
      style={{
        backgroundImage: `url('../../../public/imgs/bg-cartoons-light.webp')`,
      }}
    >
      <div
        className='bg-gradient-to-tl from-amber-50 via-orange-50 to-amber-50
        w-full h-[50px] shadow-lg shadow-neutral-200'
      >
        <div className='flex h-full items-center max-w-[1280px] m-auto justify-between'>
          <div>Pinta2</div>
          <div>Crear sala | Unirse | Contacto | Ayuda?</div>
        </div>
      </div>
      <div className='max-w-[1280px] m-auto mt-3'>{children}</div>
    </div>
  );
};
