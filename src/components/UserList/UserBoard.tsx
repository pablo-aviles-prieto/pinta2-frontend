import { FC, useEffect } from 'react';
import { useGameData } from '../../hooks/useGameData';
import React from 'react';
import { useSocket } from '../../hooks/useSocket';

interface Props {
  extraStyles?: string;
}

const Divider = () => {
  return <hr className='h-[2px] bg-emerald-400 w-[80%] m-auto rounded-full' />;
};

// TODO: Add turnScores and totalScores correctly
// TODO: When the user guess, it should appear an animation like some stars appearing from the
// image of the user, and instead of the pencil or inspector pic, it should appear the amount
// of points are getting for that guessing. It should have a duration of 5 secs top.
// User list displayed in the container board
export const UserBoard: FC<Props> = ({ extraStyles }) => {
  const { userList, gameState } = useGameData();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('user guessed', ({ msg }: { msg: string }) => {
      console.log('CHCEK user board comp', msg);
    });

    return () => {
      socket.off('user guessed');
    };
  }, [socket]);

  const renderImg = (isDrawer: boolean) => {
    return isDrawer ? (
      <img
        className='max-w-none w-[97%]'
        src='../../../public/imgs/painter.png'
        alt='Pintando...'
      />
    ) : (
      <img
        className='max-w-none w-[115%]'
        src='../../../public/imgs/inspector-gadget.png'
        alt='Investigando...'
      />
    );
  };

  return (
    <div
      className={`rounded-lg bg-indigo-100 border border-emerald-500 ${
        extraStyles ?? ''
      }`}
    >
      <ul>
        {gameState.started && gameState.drawer && gameState.totalScores
          ? Object.entries(gameState.totalScores)
              .sort(([, a], [, b]) => b.value - a.value)
              .map(([key, val], i) => {
                const user = userList.find((user) => user.id === key);
                const colorUser = user ? user.color.toLowerCase() : '#ff0000';
                return (
                  // TODO: Dont show image at all when player not playing the round
                  // (or use a stop image or something alike)
                  <React.Fragment key={key}>
                    {i > 0 && <Divider />}
                    <li className='p-3'>
                      <div
                        className={`w-20 h-20 m-auto mb-1 bg-transparent rounded-full 
                        overflow-hidden border-4`}
                        style={{
                          borderColor: colorUser,
                          backgroundColor: colorUser,
                        }}
                      >
                        {/* TODO: Render pencil SVG near photo of drawer */}
                        {renderImg(user?.id === gameState.drawer?.id)}
                      </div>
                      {/* TODO: Style the turnScores and totalScores */}
                      <div className='text-center'>
                        <p className='text-xl leading-6'>{val.name}</p>
                        <p className='leading-5'>
                          <span className='text-lg font-bold leading-5'>
                            {val.value}
                          </span>
                          <span className='text-xs leading-5'>pts</span>
                        </p>
                      </div>
                      {/* <p className='text-center'>
                        {val.name} - Total:{val.value} / Turno:
                        {!gameState.turnScores
                          ? 0
                          : gameState.turnScores[key]?.value ?? 0}
                      </p> */}
                    </li>
                  </React.Fragment>
                );
              })
          : userList.map((user, i) => (
              <React.Fragment key={user.id}>
                {i > 0 && <Divider />}
                <li className='p-3'>
                  <div
                    className={`w-20 h-20 m-auto mb-1 bg-transparent rounded-full 
                    overflow-hidden border-4 flex items-center justify-center`}
                    style={{
                      borderColor: user.color,
                      backgroundColor: user.color,
                    }}
                  >
                    <p className='text-5xl'>
                      {user.name.trim().slice(0, 1).toUpperCase()}
                    </p>
                  </div>
                  <p className='text-center'>{user.name}</p>
                </li>
              </React.Fragment>
            ))}
      </ul>
    </div>
  );
};
