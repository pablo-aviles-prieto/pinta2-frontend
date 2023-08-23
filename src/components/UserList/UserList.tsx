import { useGameData } from '../../hooks/useGameData';

// TODO: Refactor component to accept props to hide some total or turn score
// Plain user list component. Has to show no score, or turnScores, or totalScores or both of them
export const UserList = () => {
  const { userList, gameState } = useGameData();

  return (
    <div>
      {gameState.started && gameState.drawer && gameState.totalScores ? (
        <>
          <table className='text-center table-auto min-w-[300px]'>
            <thead>
              <tr className='text-lg text-teal-900'>
                <th className='w-[2/4]' />
                <th className='w-[1/4]'>Total</th>
                <th className='w-[1/4]'>Turno</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gameState.totalScores)
                .sort(([, a], [, b]) => b.value - a.value)
                .map(([key, val], i) => {
                  return (
                    <tr
                      key={key}
                      className={`h-[40px] border-b-2 border-emerald-500 border-opacity-20
                      ${
                        i ===
                          Object.keys(gameState.totalScores ?? {}).length - 1 &&
                        '!border-b-0'
                      }`}
                    >
                      <td
                        className='text-2xl font-bold text-left text-teal-900 '
                        style={{ fontFamily: 'Amaranth' }}
                      >
                        {val.name}
                      </td>
                      <td className='text-xl font-bold text-teal-600'>
                        {val.value}
                      </td>
                      <td className='text-xl font-bold text-teal-600'>
                        {!gameState.turnScores
                          ? 0
                          : gameState.turnScores[key]?.value ?? 0}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      ) : (
        userList.map((user) => <li key={user.id}>{user.name}</li>)
      )}
    </div>
  );
};
