import { FC } from 'react';
import { useGameData } from '../../hooks/useGameData';
import React from 'react';
import { GreenArrowUp, PencilStraight } from '../Icons';
import { useSocket } from '../../hooks/useSocket';
import { UserRoomI } from '../../interfaces';

interface Props {
  extraStyles?: string;
}

const Divider = () => {
  return <hr className='h-[2px] bg-emerald-400 w-[80%] m-auto rounded-full' />;
};

// User list displayed in the container board
export const UserBoard: FC<Props> = ({ extraStyles }) => {
  const { userList, gameState, usersNotPlaying } = useGameData();
  const { socket } = useSocket();

  const renderImg = ({
    isDrawer,
    usersNotPlaying,
    user,
  }: {
    isDrawer: boolean;
    usersNotPlaying: string[];
    user: UserRoomI | undefined;
  }) => {
    // In case that a user is in the usersNotPlaying array, displaying a forbidden img
    if (user && usersNotPlaying.includes(user.id)) {
      return (
        <img
          className='w-full max-w-none'
          src='../../../public/imgs/forbidden.webp'
          alt='Pintando...'
        />
      );
    }
    return isDrawer ? (
      <img
        className='max-w-none w-[97%]'
        src='../../../public/imgs/painter.webp'
        alt='Pintando...'
      />
    ) : (
      <img
        className='max-w-none w-[115%]'
        src='../../../public/imgs/inspector-gadget.webp'
        alt='Investigando...'
      />
    );
  };

  return (
    <div
      className={`rounded-lg bg-indigo-100 border border-emerald-500 shadow-lg ${
        extraStyles ?? ''
      } overflow-auto`}
    >
      <ul>
        {gameState.started && gameState.drawer && gameState.totalScores
          ? Object.entries(gameState.totalScores)
              .sort(([, a], [, b]) => b.value - a.value)
              .map(([key, val], i) => {
                const user = userList.find((user) => user.id === key);
                const colorUser = user ? user.color.toLowerCase() : '#bd0000';
                return (
                  <React.Fragment key={key}>
                    {i > 0 && <Divider />}
                    <li className='p-2 pt-3'>
                      <div className='relative'>
                        <div
                          className={`w-20 h-20 m-auto mb-1 rounded-full 
                        overflow-hidden border-2`}
                          style={{
                            borderColor:
                              socket?.id === user?.id ? '#ff0000' : colorUser,
                            backgroundColor: colorUser,
                          }}
                        >
                          {gameState.drawer?.id === user?.id && (
                            <div className='absolute top-4 -left-5'>
                              <PencilStraight width={50} height={50} />
                            </div>
                          )}
                          {renderImg({
                            isDrawer: user?.id === gameState.drawer?.id,
                            usersNotPlaying,
                            user,
                          })}
                          {gameState.turnScores && (
                            <div
                              className={`absolute -bottom-5 -right-5 transition-all duration-1000 ${
                                gameState.turnScores[key]?.value
                                  ? 'top-3 opacity-100'
                                  : 'top-[70px] opacity-0'
                              }`}
                            >
                              <div className='relative'>
                                <GreenArrowUp width={85} height={85} />
                                <p
                                  className={`absolute text-xl font-bold text-center top-6 left-[50%]
                                  -translate-x-[50%]`}
                                  style={{ textShadow: '1px 1px 1px white' }}
                                >
                                  +{gameState.turnScores[key]?.value}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='text-center'>
                        <p className='text-xl leading-6'>{val.name}</p>
                        <p className='leading-5'>
                          <span className='text-lg font-bold leading-5'>
                            {val.value}
                          </span>
                          <span className='text-xs leading-5'>pts</span>
                        </p>
                      </div>
                    </li>
                  </React.Fragment>
                );
              })
          : userList.map((user, i) => (
              <React.Fragment key={user.id}>
                {i > 0 && <Divider />}
                <li className='p-2 pt-3'>
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
