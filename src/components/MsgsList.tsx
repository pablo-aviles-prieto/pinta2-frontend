import { FC } from 'react';
import type { ChatMsgsI } from '../interfaces';

interface Props {
  messages: ChatMsgsI[];
}

export const MsgsList: FC<Props> = ({ messages }) => {
  return (
    <ul>
      {messages.map((event, index) => (
        <li key={index}>
          {event.user}: {event.msg}
        </li>
      ))}
    </ul>
  );
};
