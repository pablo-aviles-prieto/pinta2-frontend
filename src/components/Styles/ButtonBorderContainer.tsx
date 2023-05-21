import { FC } from 'react';

const roundedClassMap = {
  none: 'rounded-none',
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
  full: 'rounded-full',
};

interface PropsI {
  children: JSX.Element;
  classes?: string;
  rounded?: keyof typeof roundedClassMap;
}

export const ButtonBorderContainer: FC<PropsI> = ({
  children,
  classes,
  rounded,
}) => {
  const roundedClass = roundedClassMap[rounded || 'large'];

  return (
    <div
      className={`${classes} w-full p-[2px] ${roundedClass} 
    bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800
    hover:from-purple-800 hover:via-violet-400 hover:to-purple-800`}
    >
      {children}
    </div>
  );
};

ButtonBorderContainer.defaultProps = {
  classes: '',
  rounded: 'large',
};
