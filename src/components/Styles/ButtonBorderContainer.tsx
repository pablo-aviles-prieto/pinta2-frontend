import { FC } from 'react';

interface PropsI {
  children: JSX.Element;
  classes?: string;
  rounded?: string;
}

export const ButtonBorderContainer: FC<PropsI> = ({
  children,
  classes,
  rounded,
}) => {
  return (
    <div
      className={`${classes} w-full p-[2px] rounded-[${rounded}] 
    bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800
    hover:from-purple-800 hover:via-violet-400 hover:to-purple-800`}
    >
      {children}
    </div>
  );
};

ButtonBorderContainer.defaultProps = {
  classes: '',
  rounded: '10px',
};
