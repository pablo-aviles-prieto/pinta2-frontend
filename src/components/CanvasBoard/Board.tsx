import { FC, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import { useSocket } from '../../hooks/useSocket';
import { Chat } from '../Chat';
import { useModal } from '../../hooks/useModal';
import { useGameData } from '../../hooks/useGameData';
import type { GameStateI, UserRoomI, LinesI } from '../../interfaces';
import { useTurnCounter } from '../../hooks/useTurnCounter';
import { useGenericTimer } from '../../hooks/useGenericTimer';
import { PreTurnCountDown } from '../PreTurnCountDown';
import { UserList } from '../UserList/UserList';
import {
  DEFAULT_TURN_DURATION,
  MAX_POINTS_IN_SINGLE_ARRAY,
} from '../../utils/const';
import { useCustomToast } from '../../hooks/useCustomToast';
import { GuessedWord } from '../GuessedWord';

interface Props {
  setAwaitPlayersMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGameCancelled: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface JoinRoomDirectlyResponse {
  success: boolean;
  newUsers?: UserRoomI[];
  isPlaying?: boolean;
  gameState?: GameStateI;
}

// TODO: Should be a page and not a component!
// TODO: Has to check for query params (room & pw), so user can access directly
export const Board: FC<Props> = ({ setAwaitPlayersMsg, setGameCancelled }) => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<LinesI[]>([]);
  const [drawColor, setDrawColor] = useState('#df4b26');
  const [drawStroke, setDrawStroke] = useState(5);
  const [possibleCategories, setPossibleCategories] = useState<string[]>([]);
  const [possibleTurnDuration, setPosibleTurnDuration] = useState<
    Record<string, number>
  >({});
  const [possibleWords, setPossibleWords] = useState<string[]>([]);
  const [displayGuessedWord, setDisplayGuessedWord] = useState(false);
  const [guessedMsgDisplayed, setGuessedMsgDisplayed] = useState<
    string | undefined
  >(undefined);
  const isDrawing = useRef(false);
  const { socket, joinedRoom, setIsRegistered, setUsername } = useSocket();
  const { showToast } = useCustomToast();
  const {
    RenderModal: ModalOwnerCategories,
    closeModal: closeModalOwner,
    openModal: openModalOwner,
  } = useModal();
  const {
    RenderModal: SelectWordsModal,
    closeModal: closeWordsModal,
    openModal: openWordsModal,
  } = useModal();
  const {
    gameState,
    userList,
    categorySelected,
    turnDuration,
    isDrawer,
    isPlaying,
    setUserList,
    setCategorySelected,
    setGameState,
    setTurnDuration,
    setIsDrawer,
    setIsPlaying,
  } = useGameData();
  const {
    count: turnCount,
    startCounter: startTurnCounter,
    setStartCounter: setTurnStartCounter,
    handleCounterState: handleTurnCounter,
    resetCounterState: resetTurnCounter,
  } = useTurnCounter({
    onCountDownComplete: () => {
      if (isDrawer) {
        socket?.emit('turn finished', { roomNumber: joinedRoom });
      }
    },
  });
  const {
    count: preTurnCount,
    startCounter: preTurnStartCounter,
    handleCounterState: handlePreTurnCounter,
  } = useGenericTimer({
    initTimerValue: 3,
    onCountDownComplete: () => {
      if (isDrawer) {
        socket?.emit('starting turn', { roomNumber: joinedRoom });
      }
    },
  });
  const {
    count: configGameCounter,
    handleCounterState: handleConfigGameCounter,
  } = useGenericTimer({
    initTimerValue: 30, // ?TODO: Change the number? for the config game modal
    onCountDownComplete: () => {
      socket?.emit('init game', {
        roomNumber: joinedRoom,
        turnDuration: (turnDuration ?? 120) * 1000,
        categorySelected,
      });
      closeModalOwner();
      // removing possible messages when starting the game
      setAwaitPlayersMsg(undefined);
      setGameCancelled(undefined);
    },
  });
  const {
    count: selectWordCounter,
    handleCounterState: handleSelectWordCount,
  } = useGenericTimer({
    initTimerValue: 10,
    onCountDownComplete: () => {
      const randomIndex = Math.floor(Math.random() * 3); // random number [0-2]
      socket?.emit('set drawer word', {
        roomNumber: joinedRoom,
        word: possibleWords[randomIndex],
      });
      closeWordsModal();
    },
  });
  const {
    RenderModal: ScoreBoardModal,
    closeModal: closeScoreBoardModal,
    openModal: openScoreBoardModal,
  } = useModal();
  const {
    count: scoreBoardCounter,
    handleCounterState: handleScoreBoardCount,
  } = useGenericTimer({
    initTimerValue: 10,
    onCountDownComplete: () => {
      if (isDrawer) {
        socket?.emit('scoreboard finished', { roomNumber: joinedRoom });
      }
      closeScoreBoardModal();
    },
  });
  const {
    RenderModal: EndGameModal,
    closeModal: closeEndGameModal,
    openModal: openEndGameModal,
    setContent: setEndGameContent,
  } = useModal();
  const { handleCounterState: handleGuessedWordCounter } = useGenericTimer({
    initTimerValue: 3,
    onCountDownComplete: () => {
      setDisplayGuessedWord(false);
    },
  });

  console.log('gameState', gameState);
  // console.log('userList', userList);

  useEffect(() => {
    setIsDrawer(socket?.id === gameState.drawer?.id);
  }, [socket?.id, gameState.drawer?.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      'update user list',
      ({
        newUsers,
        action,
        msg,
        newUser,
        gameState: newGameState,
      }: {
        newUsers: UserRoomI[];
        action: string;
        msg: string;
        newUser?: UserRoomI;
        gameState?: GameStateI;
      }) => {
        setUserList(newUsers);

        if (action === 'join') {
          if (newGameState) {
            setGameState(newGameState);
          }

          const currentGameState =
            newGameState ?? useGameData.getState().gameState;
          if (
            newUser &&
            !currentGameState.preTurn &&
            socket?.id === currentGameState.drawer?.id
          ) {
            socket.emit('hydrate new player', {
              newUser,
              turnCount,
              draw: lines,
            });
          }

          showToast({ msg, options: { type: 'info' } });
        } else {
          showToast({ msg, options: { type: 'warning' } });
        }
      }
    );

    return () => {
      socket.off('update user list');
    };
  }, [turnCount, lines]);

  useEffect(() => {
    if (!socket) return;

    // Separate the useEffect, to listen to isPlaying changes
    socket.on('countdown preDraw start', () => {
      console.log('CHECK isPlaying =>', isPlaying);
      const currentGameState = useGameData.getState().gameState;
      if (currentGameState.preTurn) {
        setGameState({ ...currentGameState, preTurn: false });
      }
      if (isPlaying) {
        setIsPlaying(false);
      }
      handlePreTurnCounter(true);
      clearBoard();
    });

    return () => {
      socket.off('countdown preDraw start');
    };
  }, [socket, isPlaying]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new segment', (lineNumber: number, lineSegment: LinesI) => {
      setLines((lines) => {
        const updatedLines = [...lines];
        if (updatedLines[lineNumber]) {
          updatedLines[lineNumber].points = lineSegment.points;
        } else {
          updatedLines.push({ ...lineSegment });
        }
        return updatedLines;
      });
    });

    socket.on('clear board', () => {
      setLines([]);
    });

    socket.on(
      'pre game owner',
      ({
        categories,
        possibleTurnDurations,
      }: {
        categories: string[];
        possibleTurnDurations: Record<string, number>;
      }) => {
        closeEndGameModal(); // in case it is opened from a restart game
        setPossibleCategories(categories);
        setPosibleTurnDuration(possibleTurnDurations);
        openModalOwner();
        handleConfigGameCounter(true);
      }
    );

    socket.on(
      'pre turn drawer',
      ({ possibleWords }: { possibleWords: string[] }) => {
        setPossibleWords(possibleWords);
        openWordsModal();
        handleSelectWordCount(true);
      }
    );

    socket.on('pre turn no drawer', ({ message }: { message: string }) => {
      // TODO: Print the message somewhere in the UI for the no drawers
      console.log('message no drawer', message);
    });

    socket.on(
      'update game state front',
      ({ gameState }: { gameState: GameStateI }) => {
        setGameState(gameState);
      }
    );

    socket.on(
      'countdown turn',
      ({ usersGuessing }: { usersGuessing: number }) => {
        const currentGameState = useGameData.getState().gameState;
        const currentTurnDuration = useGameData.getState().turnDuration;
        // update the usersGuessing
        setGameState({
          ...currentGameState,
          usersGuessing,
        });
        resetTurnCounter(currentTurnDuration ?? DEFAULT_TURN_DURATION);
        setTurnStartCounter(true);
      }
    );

    // Set the turn duration to all users in the room except for the leader
    socket.on(
      'set new turn duration',
      ({ turnDuration }: { turnDuration: number }) => {
        setTurnDuration(turnDuration / 1000);
      }
    );

    socket.on(
      'guessed word',
      ({
        totalScores,
        turnScores,
        updatedTime,
      }: {
        id: string;
        msg: string;
        totalScores: GameStateI['totalScores'];
        turnScores: GameStateI['turnScores'];
        updatedTime: number;
      }) => {
        const currentGameState = useGameData.getState().gameState;
        setGameState({ ...currentGameState, totalScores, turnScores });
        resetTurnCounter(updatedTime);
      }
    );

    socket.on('show scoreboard', () => {
      setTurnStartCounter(false);
      openScoreBoardModal();
      handleScoreBoardCount(true);
    });

    socket.on('game ended', ({ owner }: { owner: string }) => {
      const currentGameState = useGameData.getState().gameState;
      const TopMsg =
        owner === socket.id ? (
          <button
            type='button'
            onClick={() => {
              socket.emit('restart game', {
                roomNumber: joinedRoom,
              });
            }}
          >
            Volver a jugar!
          </button>
        ) : (
          <div>Esperando a que el lider decida...</div>
        );
      setGameState({ ...currentGameState, endGame: true });
      setTurnStartCounter(false);
      setEndGameContent(TopMsg);
      openEndGameModal();
    });

    socket.on('close endgame modal', () => {
      closeEndGameModal();
    });

    // Set the category to all users in the room except for the leader
    socket.on('update category front', ({ category }: { category: string }) => {
      setCategorySelected(category);
    });

    // Not using the msg property in this component, that comes from this event
    socket.on('game cancelled', () => {
      setTurnStartCounter(false);
    });

    // update the EndGameModal content if the owner left during endGame
    socket.on('resend game ended', ({ owner }: { owner: string }) => {
      const UpdateMsg =
        owner === socket.id ? (
          <button
            type='button'
            onClick={() => {
              socket.emit('restart game', {
                roomNumber: joinedRoom,
              });
            }}
          >
            Volver a jugar!
          </button>
        ) : (
          <div>Esperando a que el lider decida...</div>
        );
      setEndGameContent(UpdateMsg);
    });

    // update the counter and the lines for a user who joined in the middle of the turn
    socket.on(
      'current game data',
      ({
        turnCount,
        draw,
      }: {
        turnCount: number | undefined;
        draw: LinesI[];
      }) => {
        if (turnCount) {
          resetTurnCounter(turnCount);
          setTurnStartCounter(true);
        }
        setLines(draw);
      }
    );

    // display the msg in the middle of the screen (msg used on GuessedWord component)
    socket.on('user guessed', ({ msg }: { msg: string }) => {
      setGuessedMsgDisplayed(msg);
      setDisplayGuessedWord(true);
      handleGuessedWordCounter(true);
    });

    // TODO: Maybe has to be moved in a parent/previous route
    // probably not, since the disconnect option would be in the BoardContainer, and this
    // component should be mounted
    socket.on('disconnect', () => {
      setIsRegistered(false);
      setUsername('');
      // TODO: navigate to path '/' with a state prop 'notRegistered' in the navigate
    });

    socket.on(
      'join room directly response',
      ({
        success,
        gameState,
        isPlaying,
        newUsers,
      }: JoinRoomDirectlyResponse) => {
        if (success) {
          // if the game started, set the turnDuration for future turns
          if (gameState && gameState.started) {
            setTurnDuration(
              gameState.turnDuration
                ? gameState.turnDuration / 1000
                : DEFAULT_TURN_DURATION
            );
          }
          newUsers && setUserList(newUsers);
          gameState && setGameState(gameState);
          isPlaying && setIsPlaying(isPlaying);
        }
      }
    );

    // TODO: Create the routes to join directly to the room!
    // TODO: Apply some sound for the preTurnCount (for each of the 3 seconds)
    // TODO: Send an event in some concrete timers, so the backend gives back hints for the word
    // TODO: Add a button to copy the link to a friend in the Board

    return () => {
      socket.off('new segment');
      socket.off('clear board');
      socket.off('pre game owner');
      socket.off('pre turn drawer');
      socket.off('pre turn no drawer');
      socket.off('update game state front');
      socket.off('countdown turn');
      socket.off('set new turn duration');
      socket.off('guessed word');
      socket.off('show scoreboard');
      socket.off('game ended');
      socket.off('close endgame modal');
      socket.off('update category front');
      socket.off('game cancelled');
      socket.off('resend game ended');
      socket.off('current game data');
      socket.off('user guessed');
      socket.off('disconnect');
      socket.off('join room directly response');
    };
  }, []);

  const handleTurnDuration = (turnDuration: number) => {
    setTurnDuration(turnDuration / 1000); // parsing it to seconds
  };

  const handleCategoryChoice = (category: string) => {
    setCategorySelected(category);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (
      !e.target ||
      (gameState.started && gameState.drawer?.id !== socket?.id)
    ) {
      return;
    }

    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        color: drawColor,
        strokeWidth: drawStroke,
      },
    ]);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (
      !e.target ||
      !isDrawing.current ||
      (gameState.started && gameState.drawer?.id !== socket?.id)
    ) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const newLines = [...lines];
    const lastLine = newLines[newLines.length - 1];

    // If lastLine has reached the limit, start a new line
    if (lastLine.points.length >= MAX_POINTS_IN_SINGLE_ARRAY) {
      const newLine = {
        ...lastLine,
        // Add the last point of the old line as the first point of the new line to avoid a gap
        points: [...lastLine.points.slice(-2), point.x, point.y],
      };
      newLines.push(newLine);
      socket?.emit('new segment', {
        lineLength: newLines.length - 1,
        lineSegment: newLine,
        roomNumber: joinedRoom,
      });
    } else {
      // add point to the existing line
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      // replace the last line in newLines with the updated lastLine
      newLines[newLines.length - 1] = lastLine;
      socket?.emit('new segment', {
        lineLength: newLines.length - 1,
        lineSegment: lastLine,
        roomNumber: joinedRoom,
      });
    }

    setLines(newLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearBoard = () => {
    setLines([]);
    socket?.emit('clear board', { roomNumber: joinedRoom });
  };

  const handleStartGame = () => {
    if (!categorySelected || userList.length < 3) return; // TODO: Use a toast to provide feedback

    socket?.emit('init game', {
      roomNumber: joinedRoom,
      turnDuration: (turnDuration ?? 120) * 1000,
      categorySelected,
    });
    closeModalOwner();
    handleConfigGameCounter(false);
    // removing possible messages when starting the game
    setAwaitPlayersMsg(undefined);
    setGameCancelled(undefined);
  };

  const handleAwaitMorePlayers = () => {
    socket?.emit('await more players', { roomNumber: joinedRoom });
    closeModalOwner();
    handleConfigGameCounter(false);
  };

  return (
    // TODO: Add color and strokeWidth to the lines, and handle it to receive'em
    // TODO: Extract the drawing tools into a component
    // TODO: Display a button to start the game (in case is waiting for more players and no one join)
    // TODO: Disable the input when user is in turnScore ???
    // TODO: Add a restart game button for the owner (it should display a modal to confirm the action)!
    <>
      {gameState.started &&
        gameState.turn !== undefined &&
        gameState.round !== undefined && (
          <div className='my-4'>
            <p>Turn: {gameState.turn}</p>
            <p>Round: {gameState.round}</p>
          </div>
        )}
      {gameState.started && !gameState.preTurn && startTurnCounter && (
        <div className='my-8'>
          <p>{turnCount}</p>
          {gameState.currentWord && (
            <p>{isDrawer ? gameState.currentWord : gameState.cryptedWord}</p>
          )}
        </div>
      )}
      <div className='my-4'>
        <button onClick={() => handleTurnCounter(true)}>Restart timer</button>
      </div>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value='pen'>Pen</option>
        <option value='eraser'>Eraser</option>
      </select>
      {(!gameState.started || gameState.drawer?.id === socket?.id) && (
        <button type='button' onClick={clearBoard}>
          Clear board
        </button>
      )}
      {
        <button
          className='ml-6'
          type='button'
          onClick={() =>
            setDrawColor((prevColor) =>
              prevColor === '#df4b26' ? '#23ad01' : '#df4b26'
            )
          }
        >
          Green/red color
        </button>
      }
      <div className='py-5 bg-gray-300'>
        <div className='mx-auto flex gap-5 w-[1100px] h-[600px]'>
          <Stage
            width={770}
            height={600}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            className='bg-white rounded-lg shadow-md'
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color ?? '#df4b26'}
                  strokeWidth={5}
                  tension={0.5}
                  lineCap='round'
                  lineJoin='round'
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
          <div className='w-[278px] h-full bg-white rounded-lg shadow-md'>
            <Chat joinedRoom={joinedRoom} turnCount={turnCount} />
          </div>
        </div>
      </div>
      {!gameState.started && (
        <ModalOwnerCategories forbidClose>
          <>
            {/* TODO: Restyle the counter of config game */}
            <div className='absolute top-2 right-2'>{configGameCounter}</div>
            <h1 className='text-xl font-bold text-center text-teal-800'>
              Configura la partida!
            </h1>
            <div className='my-4'>
              <h3 className='text-lg'>Selecciona una categoría!</h3>
              <div className='flex gap-2'>
                {possibleCategories.map((cat) => (
                  <p
                    key={cat}
                    className={`border-teal-600 border-2 cursor-pointer px-2 py-1 ${
                      categorySelected === cat && 'bg-teal-200'
                    }`}
                    onClick={() => handleCategoryChoice(cat)}
                  >
                    {cat}
                  </p>
                ))}
              </div>
            </div>
            <div className='my-4'>
              <h3 className='text-lg'>
                Elige cuantos segundos tendreis por turno! (120s por defecto)
              </h3>
              <div className='flex gap-2'>
                {Object.entries(possibleTurnDuration).map(([key, value]) => (
                  <p
                    key={key}
                    className={`border-teal-600 border-2 cursor-pointer px-2 py-1 ${
                      turnDuration === value / 1000 && 'bg-teal-200'
                    }`}
                    onClick={() => handleTurnDuration(value)}
                  >
                    {value / 1000}s
                  </p>
                ))}
              </div>
            </div>
            <div className='my-4'>
              <h3 className='text-lg'>Usuarios conectados:</h3>
              <ul>
                {userList.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </div>
            <div className='flex items-center justify-between'>
              <button onClick={handleAwaitMorePlayers}>
                Esperar + jugadores
              </button>
              <button onClick={handleStartGame}>Empezar la partida</button>
            </div>
          </>
        </ModalOwnerCategories>
      )}
      {gameState.started && gameState.preTurn && (
        <SelectWordsModal forbidClose>
          <div>
            {/* TODO: Restyle the counter of words modal choice */}
            <div className='absolute top-2 right-2'>{selectWordCounter}</div>
            Selecciona una palabra:{' '}
            <div className='flex gap-2'>
              {possibleWords.map((word) => (
                <p
                  key={word}
                  className={`border-teal-600 border-2 cursor-pointer px-2 py-1 hover:bg-teal-200`}
                  onClick={() => {
                    socket?.emit('set drawer word', {
                      roomNumber: joinedRoom,
                      word,
                    });
                    closeWordsModal();
                    handleSelectWordCount(false);
                  }}
                >
                  {word}
                </p>
              ))}
            </div>
          </div>
        </SelectWordsModal>
      )}
      {preTurnStartCounter && !gameState.preTurn && (
        <PreTurnCountDown preTurnCount={preTurnCount} />
      )}
      {gameState.started && gameState.preTurn && !displayGuessedWord && (
        <ScoreBoardModal forbidClose>
          <div>
            <div className='absolute top-2 right-2'>{scoreBoardCounter}</div>
            <h1>Puntuaciones:</h1>
            {/* TODO: Refactor UserList to not show Jugadores: */}
            <UserList />
          </div>
        </ScoreBoardModal>
      )}
      {gameState.started && gameState.preTurn && !displayGuessedWord && (
        <EndGameModal forbidClose>
          <div>
            <h1>Puntuación final:</h1>
            {/* TODO: Refactor UserList to not show Jugadores: */}
            <UserList />
          </div>
        </EndGameModal>
      )}
      {displayGuessedWord && <GuessedWord msg={guessedMsgDisplayed} />}
    </>
  );
};
