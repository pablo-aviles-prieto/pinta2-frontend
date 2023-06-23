import { create } from 'zustand';
import type { UserRoomI, GameStateI } from '../interfaces';
import { DEFAULT_CATEGORY_SELECTED, DEFAULT_TURN_DURATION } from '../utils/const';

interface GameDataStore {
  userList: UserRoomI[];
  gameState: GameStateI;
  categorySelected: string | null;
  turnDuration: number | null; // stored in seconds
  isDrawer: boolean;
  setUserList: (userList: UserRoomI[]) => void;
  setGameState: (gameState: GameStateI) => void;
  setCategorySelected: (categorySelected: string | null) => void;
  setTurnDuration: (turnDuration: number | null) => void;
  setIsDrawer: (condition: boolean) => void;
}

const INIT_GAME_STATE = {
  started: false,
};

export const useGameData = create<GameDataStore>((set) => {
  return {
    userList: [],
    gameState: INIT_GAME_STATE,
    categorySelected: DEFAULT_CATEGORY_SELECTED,
    turnDuration: DEFAULT_TURN_DURATION,
    isDrawer: false,
    setUserList: (userList: UserRoomI[]) => set({ userList }),
    setGameState: (gameState: GameStateI) => set({ gameState }),
    setCategorySelected: (categorySelected: string | null) =>
      set({ categorySelected }),
    setTurnDuration: (turnDuration: number | null) => set({ turnDuration }),
    setIsDrawer: (condition: boolean) => set({ isDrawer: condition }),
  };
});
