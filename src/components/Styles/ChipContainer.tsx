import { FC } from 'react';

interface Props {
  children: JSX.Element;
  selectedCondition?: boolean;
  extraClasses?: string;
  onClick?: () => void;
}

export const ChipContainer: FC<Props> = ({
  children,
  selectedCondition,
  extraClasses,
  onClick,
}) => {
  return (
    <p
      className={`border-teal-600 border cursor-pointer px-2 py-1 rounded-3xl
     hover:bg-teal-400 hover:border-teal-800 
      ${extraClasses && extraClasses}
      ${selectedCondition && 'bg-teal-300 border-teal-800 hover:bg-teal-300'}
      `}
      onClick={onClick && onClick}
    >
      {children}
    </p>
  );
};
