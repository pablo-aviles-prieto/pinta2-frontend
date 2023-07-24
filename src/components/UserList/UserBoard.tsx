import { FC } from 'react';
import { useGameData } from '../../hooks/useGameData';

interface Props {
  extraStyles?: string;
}

// TODO: Circle on the left containing the image of a pencil/paint when is the drawer and a
// pic of a detective (gadget inspector) or something like that for the guessers.
// On the left, they should have the total amount of points, and when they guess (also the drawer),
// will have the +Number of the amount in small font.
// TODO: When the user guess, it should appear an animation like some stars appearing from the
// image of the user, and instead of the pencil or inspector pic, it should appear the amount
// of points are getting for that guessing. It should have a duration of 5 secs top.
// TODO: The own user should has a different border for the img container, to identify himself

// User list displayed in the container board
export const UserBoard: FC<Props> = ({ extraStyles }) => {
  const { userList, gameState } = useGameData();

  return (
    <div
      className={`bg-indigo-400 border border-blue-500 ${extraStyles ?? ''}`}
    >
      <ul>
        {gameState.started && gameState.drawer && gameState.totalScores
          ? Object.entries(gameState.totalScores)
              .sort(([, a], [, b]) => b.value - a.value)
              .map(([key, val]) => {
                return (
                  <li key={key}>
                    {val.name} - Total:{val.value} / Turno:
                    {!gameState.turnScores
                      ? 0
                      : gameState.turnScores[key]?.value ?? 0}
                  </li>
                );
              })
          : userList.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};
