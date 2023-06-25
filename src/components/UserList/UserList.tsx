import { useGameData } from '../../hooks/useGameData';

// TODO: Set another color for the user
export const UserList = () => {
  const { userList, gameState } = useGameData();

  return (
    <div className='mt-4'>
      Jugadores:
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
