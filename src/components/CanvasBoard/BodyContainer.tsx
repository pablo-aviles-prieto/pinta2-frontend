import { ConnectionManager } from '../ConnectionManager';
import { Board } from './Board';

export const BodyContainer = () => {
  return (
    <>
      <ConnectionManager />
      <Board />
    </>
  );
};
