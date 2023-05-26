import { create } from 'zustand';
import type { UserRoomI, GameStateI } from '../interfaces';

interface GameDataStore {
  userList: UserRoomI[];
  gameState: GameStateI;
  categorySelected: string | null;
  turnDuration: number | null; // stored in seconds
  setUserList: (userList: UserRoomI[]) => void;
  setGameState: (gameState: GameStateI) => void;
  setCategorySelected: (categorySelected: string | null) => void;
  setTurnDuration: (turnDuration: number | null) => void;
}

const INIT_GAME_STATE = {
  started: false,
};

export const useGameData = create<GameDataStore>((set) => {
  return {
    userList: [],
    gameState: INIT_GAME_STATE,
    categorySelected: null,
    turnDuration: null,
    setUserList: (userList: UserRoomI[]) => set({ userList }),
    setGameState: (gameState: GameStateI) => set({ gameState }),
    setCategorySelected: (categorySelected: string | null) =>
      set({ categorySelected }),
    setTurnDuration: (turnDuration: number | null) => set({ turnDuration }),
  };
});
