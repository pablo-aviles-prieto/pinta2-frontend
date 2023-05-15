import { useState, useEffect } from 'react';
import { ConnectionState } from './ConnectionState';
import { ConnectionManager } from './ConnectionManager';
import { MsgsList } from './MsgsList';
import { Chat } from './Chat';
import { Board } from './Board';
import { useSocket } from '../hooks/useSocket';
import type { ChatMsgsI } from '../interfaces';

export const BodyContainer = () => {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatMsgs, setChatMsgs] = useState<ChatMsgsI[]>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMsg(value: ChatMsgsI) {
      setChatMsgs((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat msg', onChatMsg);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat msg', onChatMsg);
    };
  }, []);

  return (
    <>
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
      <MsgsList messages={chatMsgs} />
      <Chat />
      <hr />
      <Board />
    </>
  );
};
