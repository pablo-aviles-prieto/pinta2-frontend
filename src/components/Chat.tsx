import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { ChatMsgsI } from '../interfaces';

export const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsgsI[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    function onChatMsg(value: ChatMsgsI) {
      setChatMsgs((previous) => [...previous, value]);
    }

    socket?.on('chat msg', onChatMsg);

    return () => {
      socket?.off('chat msg', onChatMsg);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    socket?.emit('chat msg', message.trim());
    setMessage('');
  }

  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <ul>
        {chatMsgs.map((event, index) => (
          <li key={index} className='break-words'>
            {event.user}: {event.msg}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <form onSubmit={onSubmit}>
        <input
          placeholder='Type a message...'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className='px-2'
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};
