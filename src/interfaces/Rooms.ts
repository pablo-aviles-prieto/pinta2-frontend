export interface UserRoomI {
  id: string;
  name: string;
}

export interface GameStateI {
  started: boolean;
  category?: string;
  currentWord?: string;
  drawer?: UserRoomI;
  round?: number; // the current round number (initialize in 1)
  turn?: number; // the current drawing turn (initialize in 0)
  preTurn?: boolean;
  previousWords?: string[];
  scores?: {
    // storing as key the socket.id of the users
    [key: string]: { name: string; value: number };
  };
}
