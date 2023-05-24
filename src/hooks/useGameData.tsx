import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';

interface GameStateI {
  started: boolean;
  category?: string;
  currentWord?: string | undefined;
  drawer?: string | undefined;
  round?: number; // the current round number (initialize in 1)
  turn?: number; // the current drawing turn (initialize in 0)
  scores?: {
    // storing as key the socket.id of the users
    [key: string]: number;
  };
}

interface UserRoomI {
  id: string;
  name: string;
}

const INIT_GAME_STATE = {
  started: false,
};

export const useGameData = () => {
  const [userList, setUserList] = useState<UserRoomI[]>([]);
  const [gameState, setGameState] = useState<GameStateI>(INIT_GAME_STATE);
  const [categorySelected, setCategorySelected] = useState<string | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('update user list', ({ newUsers }: { newUsers: UserRoomI[] }) => {
      setUserList(newUsers);
    });

    return () => {
      socket.off('update user list');
    };
  }, []);

  return { userList, categorySelected, setCategorySelected };
};
