import { FC, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import { useSocket } from '../../hooks/useSocket';
import { Chat } from '../Chat';
import { useModal } from '../../hooks/useModal';
import { useGameData } from '../../hooks/useGameData';
import { UserRoomI } from '../../interfaces';

interface LinesI {
  tool: string;
  points: any[];
}

const MAX_POINTS_IN_SINGLE_ARRAY = 2500;

export const Board: FC = () => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<LinesI[]>([]);
  const [possibleCategories, setPossibleCategories] = useState<string[]>([]);
  const isDrawing = useRef(false);
  const { socket, joinedRoom } = useSocket();
  const { RenderModal, closeModal, openModal } = useModal();
  const {
    gameState,
    userList,
    categorySelected,
    setUserList,
    setCategorySelected,
  } = useGameData();

  console.log('gameState', gameState);
  console.log('userList', userList);

  useEffect(() => {
    if (!socket) return;

    socket.on('new segment', (lineNumber: number, lineSegment: LinesI) => {
      setLines((lines) => {
        const updatedLines = [...lines];
        if (updatedLines[lineNumber]) {
          updatedLines[lineNumber].points = lineSegment.points;
        } else {
          updatedLines.push({
            tool: lineSegment.tool,
            points: lineSegment.points,
          });
        }
        return updatedLines;
      });
    });

    socket.on('clear board', () => {
      setLines([]);
    });

    socket.on('pre game', ({ categories }: { categories: string[] }) => {
      setPossibleCategories(categories);
      openModal();
    });

    socket.on('update user list', ({ newUsers }: { newUsers: UserRoomI[] }) => {
      setUserList(newUsers);
    });

    return () => {
      socket.off('new segment');
      socket.off('clear board');
      socket.off('pre game');
      socket.off('update user list');
    };
  }, []);

  const handleCategoryChoice = (category: string) => {
    setCategorySelected(category);
    socket?.emit('set room category', { category, roomNumber: joinedRoom });
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!e.target) {
      return;
    }

    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!e.target || !isDrawing.current) {
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

    socket?.emit('init game', { roomNumber: joinedRoom });
    closeModal();
  };

  const handleAwaitMorePlayers = () => {
    socket?.emit('await more players', { roomNumber: joinedRoom });
    closeModal()
  };

  return (
    <>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value='pen'>Pen</option>
        <option value='eraser'>Eraser</option>
      </select>
      <button type='button' onClick={clearBoard}>
        Clear board
      </button>
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
                  stroke='#df4b26'
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
            <Chat joinedRoom={joinedRoom} />
          </div>
        </div>
      </div>
      <RenderModal>
        <>
          <h1 className='text-xl font-bold text-center text-teal-800'>
            Wanna start the game?
          </h1>
          <div className='my-4'>
            <h3 className='text-lg'>
              {!categorySelected ? (
                <p>Selecciona una de las categorías:</p>
              ) : (
                <p>
                  Categoría seleccionada:{' '}
                  <span className='text-teal-600'>{categorySelected}</span>
                </p>
              )}
            </h3>
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
            <h3 className='text-lg'>Connected users:</h3>
            <ul>
              {userList.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
          <div className='flex items-center justify-between'>
            <button onClick={handleAwaitMorePlayers}>Wait for more players</button>
            <button onClick={handleStartGame}>Start the game</button>
          </div>
        </>
      </RenderModal>
    </>
  );
};
