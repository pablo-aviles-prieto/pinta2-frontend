import type { FC, ReactNode } from 'react';
import { textSize, maxWidthClasses } from '../../utils/const';

type IProps = {
  children: ReactNode;
  title?: string;
  onSubmit: (e: React.FormEvent) => void;
  containerWidth?: keyof typeof maxWidthClasses;
  titleSize?: keyof typeof textSize;
};

export const FormContainer: FC<IProps> = ({
  children,
  title,
  containerWidth,
  titleSize,
  onSubmit,
}) => {
  return (
    <div className={`w-full ${maxWidthClasses[containerWidth || 'sm']} z-[2]`}>
      <form
        onSubmit={onSubmit}
        className='py-[80px] px-[70px] pt-[70px] shadow-md bg-gradient-to-tl
        border border-emerald-400 from-amber-50 via-orange-50 to-amber-50'
        style={{ borderRadius: '23% 77% 20% 80% / 75% 32% 68% 25%' }}
      >
        {title && (
          <h3 className={`mb-2 font-bold ${textSize[titleSize || 'xl3']}`}>
            {title}
          </h3>
        )}
        {children}
      </form>
    </div>
  );
};

FormContainer.defaultProps = {
  containerWidth: 'sm',
  titleSize: 'xl3',
  title: undefined,
};
