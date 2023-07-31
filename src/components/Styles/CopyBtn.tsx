import { FC } from 'react';
import { ButtonBorderContainer } from './ButtonBorderContainer';
import { copyToClipboard } from '../../utils';
import { Copy, CopyOk } from '../Icons';

type Props = {
  copied: boolean;
  joinedRoom: number;
  roomPassword: string;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CopyBtnComponent: FC<Props> = ({
  copied,
  joinedRoom,
  roomPassword,
  setCopied,
}) => (
  <ButtonBorderContainer>
    <button
      className={`${
        copied ? 'bg-gray-500 text-white' : ''
      } w-full mx-auto text-lg
rounded-md py-2 transition flex items-center justify-evenly 
bg-gradient-to-tl from-amber-50 via-orange-50 to-amber-50
hover:text-emerald-500`}
      type='button'
      onClick={() =>
        copyToClipboard({
          isCopied: copied,
          setIsCopied: setCopied,
          roomNumber: joinedRoom,
          roomPassword,
        })
      }
    >
      <span>{copied ? 'Copiado!' : 'Copiar enlace'}</span>
      {copied ? (
        <CopyOk width={27} height={27} />
      ) : (
        <Copy width={27} height={27} />
      )}
    </button>
  </ButtonBorderContainer>
);
