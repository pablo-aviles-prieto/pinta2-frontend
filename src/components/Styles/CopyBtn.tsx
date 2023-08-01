import { FC } from 'react';
import { copyToClipboard } from '../../utils';
import { Copy, CopyOk } from '../Icons';
import { BtnContainer } from './BtnContainer';

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
  <BtnContainer
    onClickHandler={() =>
      copyToClipboard({
        isCopied: copied,
        setIsCopied: setCopied,
        roomNumber: joinedRoom,
        roomPassword,
      })
    }
  >
    <>
      <span>{copied ? 'Copiado!' : 'Copiar enlace'}</span>
      {copied ? (
        <CopyOk width={27} height={27} />
      ) : (
        <Copy width={27} height={27} />
      )}
    </>
  </BtnContainer>
);
