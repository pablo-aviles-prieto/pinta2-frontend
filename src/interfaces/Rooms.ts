export interface UserRoomI {
  id: string;
  name: string;
  color: string;
}

export interface GameStateI {
  started: boolean;
  category?: string;
  currentWord?: string;
  cryptedWord?: string;
  words?: string[];
  previousWords?: number;
  drawer?: UserRoomI;
  round?: number;
  maxRounds?: number;
  turn?: number;
  preTurn?: boolean;
  turnDuration?: number;
  usersGuessing?: number;
  endGame?: boolean;
  totalScores?: {
    [key: string]: { name: string; value: number };
  };
  turnScores?: {
    [key: string]: { name: string; value: number };
  };
}
