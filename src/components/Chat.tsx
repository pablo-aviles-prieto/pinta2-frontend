import React, { FC, useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { ChatMsgsI } from '../interfaces';
import { Send } from './Icons';
import { useGameData } from '../hooks/useGameData';
import { FALLBACK_USER_COLOR } from '../utils/const';

interface PropsI {
  joinedRoom: number | undefined;
  turnCount: number | undefined;
}

// TODO: Si se esta en partida y en turno y el usuario ya acertó, deshabilitar el input para enviar msg
// TODO: Limpiar el chat al empezar una nueva partida (tras enviar la config del game i guess)
export const Chat: FC<PropsI> = ({ joinedRoom, turnCount }) => {
  const [message, setMessage] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsgsI[]>([]);
  const lastMsgRef = useRef<HTMLLIElement | null>(null);
  const { socket } = useSocket();
  const { isPlaying } = useGameData();

  useEffect(() => {
    if (!socket) return;

    socket?.on('chat msg', onChatMsg);

    socket.on('user guessed', ({ msg }: { msg: string }) => {
      console.log('HAS ACERTADO', msg);
    });

    socket.on('guessed word', ({ msg }: { msg: string }) => {
      const {
        VITE_USER_SYSTEM_NAME: userSystemName,
        VITE_USER_SYSTEM_ID: userSystemID,
        VITE_USER_SYSTEM_COLOR: userSystemColor,
      } = import.meta.env;

      setChatMsgs((prevMsgs) => [
        ...prevMsgs,
        { id: userSystemID, user: userSystemName, msg, color: userSystemColor },
      ]);
    });

    return () => {
      socket?.off('chat msg', onChatMsg);
      socket?.off('user guessed');
      socket?.off('guessed word');
    };
  }, []);

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  function onChatMsg(msgContent: Omit<ChatMsgsI, 'color'>) {
    const currentUserList = useGameData.getState().userList;
    const userColor =
      currentUserList.find((user) => user.id === msgContent.id)?.color ??
      FALLBACK_USER_COLOR;
    setChatMsgs((previous) => [
      ...previous,
      { ...msgContent, color: userColor },
    ]);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    socket?.emit('chat msg', {
      msg: message.trim(),
      roomNumber: joinedRoom,
      turnCount,
    });
    setMessage('');
  }

  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <div className='flex flex-col-reverse h-[93%]'>
        <ul className='overflow-y-auto'>
          {chatMsgs.map((event, index) => (
            <li
              key={index}
              className='break-words'
              ref={index === chatMsgs.length - 1 ? lastMsgRef : null}
            >
              {event.id === import.meta.env.VITE_USER_SYSTEM_ID ? (
                <>
                  🎉{' '}
                  <span
                    style={{ color: '#f87f50' }}
                    className='italic font-bold'
                  >
                    {event.msg}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ color: event.color }} className='font-bold'>
                    {event.user}
                  </span>
                  : {event.msg}
                </>
              )}
            </li>
          ))}
        </ul>
        <div />
      </div>
      <form
        onSubmit={onSubmit}
        className='flex w-full py-1 border-t-2 border-gray-700'
      >
        <input
          disabled={isPlaying}
          placeholder='Type a message...'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className='w-full px-2 outline-none focus:outline-none ring-0 focus:ring-0'
        />
        <button type='submit'>
          <Send width={30} height={30} className='text-cyan-300' />
        </button>
      </form>
    </div>
  );
};
