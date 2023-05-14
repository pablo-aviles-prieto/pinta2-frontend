import { FC } from 'react';

interface Props {
  isConnected: boolean;
}

export const ConnectionState: FC<Props> = ({ isConnected }) => {
  return <p>State: {isConnected ? 'Connected' : 'Disconnected'}</p>;
};
