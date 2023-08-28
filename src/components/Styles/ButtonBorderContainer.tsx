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
      className={`${classes} w-full p-[2px] ${roundedClass} transition
    bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600
    hover:from-emerald-600 hover:via-teal-200 hover:to-emerald-600`}
    >
      {children}
    </div>
  );
};

ButtonBorderContainer.defaultProps = {
  classes: '',
  rounded: 'large',
};
