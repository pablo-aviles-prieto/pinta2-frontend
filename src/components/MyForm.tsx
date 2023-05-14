import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export function MyForm() {
  const socket = useSocket();

  const [value, setValue] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    socket.emit('chat msg', value);
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} />

      <button type='submit'>Submit msg</button>
    </form>
  );
}
