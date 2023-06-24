import { GameStateI, UserRoomI } from '../interfaces';

interface Props {
  prevTurn: number | undefined;
  currentGameState: GameStateI;
  currentUserList: UserRoomI[];
}

export const handleNextTurn = ({
  prevTurn,
  currentGameState,
  currentUserList,
}: Props) => {
  const turn = !prevTurn
    ? 0
    : prevTurn >= currentUserList.length - 1
    ? 0
    : prevTurn + 1;
  const round = !prevTurn
    ? 1
    : prevTurn >= currentUserList.length - 1 &&
      currentGameState.round !== undefined
    ? currentGameState.round + 1
    : currentGameState.round ?? 1;
  const previousWords = currentGameState.previousWords
    ? currentGameState.previousWords + 3
    : 3;

  return { turn, round, previousWords };
};
