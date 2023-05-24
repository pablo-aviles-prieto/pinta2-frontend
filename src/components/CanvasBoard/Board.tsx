import { FC, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import { useSocket } from '../../hooks/useSocket';
import { Chat } from '../Chat';
import { useModal } from '../../hooks/useModal';

interface LinesI {
  tool: string;
  points: any[];
}

const MAX_POINTS_IN_SINGLE_ARRAY = 2500;

export const Board: FC = () => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<LinesI[]>([]);
  const isDrawing = useRef(false);
  const { socket, joinedRoom } = useSocket();
  const { RenderModal, closeModal, openModal } = useModal();

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

    socket.on('start game', ({ numberOfUsers }: { numberOfUsers: number }) => {
      console.log('start game event', socket.id);
      console.log('numberOfUsers', numberOfUsers);
      // pass some info to the Modal with the help of another function in useModal??
      openModal();
    });

    return () => {
      socket.off('new segment');
      socket.off('clear board');
      socket.off('start game');
    };
  }, []);

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
          <h1>Modal Content test</h1>
          <button onClick={closeModal}>Close Modal</button>
        </>
      </RenderModal>
    </>
  );
};
