import { DefaultEventsMap } from '@socket.io/component-emitter';
import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextI {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  socketUser: string;
}

export const SocketContext = createContext<SocketContextI | undefined>(
  undefined
);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used withing a SocketProvider');
  }

  return context;
};
