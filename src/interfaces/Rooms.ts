export interface UserRoomI {
  id: string;
  name: string;
}

export interface GameStateI {
  started: boolean;
  category?: string;
  currentWord?: string;
  cryptedWord?: string;
  words?: string[]; // already shuffled
  previousWords?: number; // number of used words in the game (next turn can get the words starting with the index of this number)
  drawer?: UserRoomI;
  round?: number; // the current round number (initialize in 1)
  maxRounds?: number;
  turn?: number; // the current drawing turn (initialize in 0)
  preTurn?: boolean;
  turnDuration?: number; // number in ms
  usersGuessing?: number; // tracks how many users are playing the round (in case user joins in the middle of a round)
  endGame?: boolean; // tracks if the game is finishe
  totalScores?: {
    // storing as key the socket.id of the users
    [key: string]: { name: string; value: number };
  };
  turnScores?: {
    // storing as key the socket.id of the users
    [key: string]: { name: string; value: number };
  };
}
