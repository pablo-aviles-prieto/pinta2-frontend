import { FC } from 'react';
import { ButtonBorderContainer } from './ButtonBorderContainer';

type Props = {
  extraStyles?: string;
  children: JSX.Element
  onClickHandler: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
};

export const BtnContainer: FC<Props> = ({
  extraStyles,
  children,
  onClickHandler,
  onMouseEnter,
  onMouseLeave
}) => (
  <ButtonBorderContainer>
    <button
      className={`${extraStyles ?? ''} w-full mx-auto text-lg
        rounded-md py-2 transition flex items-center justify-evenly 
        bg-gradient-to-tl from-amber-50 via-orange-50 to-amber-50
      hover:text-teal-700`}
      type='button'
      onClick={onClickHandler}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  </ButtonBorderContainer >
);
