import { ConnectionManager } from './ConnectionManager';
import { Chat } from './Chat';
import { Board } from './Board';

export const BodyContainer = () => {
  return (
    <>
      <ConnectionManager />
      <Chat />
      <hr />
      <Board />
    </>
  );
};
