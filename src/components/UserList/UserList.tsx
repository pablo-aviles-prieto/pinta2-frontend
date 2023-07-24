import { useGameData } from '../../hooks/useGameData';

// TODO: Refactor component to accept props to hide some total or turn score
// Plain user list component. Has to show no score, or turnScores, or totalScores or both of them
export const UserList = () => {
  const { userList, gameState } = useGameData();

  return (
    <div className='mt-2'>
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
