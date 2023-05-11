import { FC } from 'react';

interface Props {
  events: string[];
}

export const Events: FC<Props> = ({ events }) => {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index}>{event}</li>
      ))}
    </ul>
  );
};
