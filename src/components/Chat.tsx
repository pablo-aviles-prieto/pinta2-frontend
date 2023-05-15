import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export function Chat() {
  const [value, setValue] = useState('');
  const socket = useSocket();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    socket.emit('chat msg', value);
    setValue('');
  }

  return (
    <form onSubmit={onSubmit}>
      {/* TODO: Use a label */}
      <input onChange={(e) => setValue(e.target.value)} value={value} />
      <button type='submit'>Submit msg</button>
    </form>
  );
}
