import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import Konva from 'konva';
import { socket } from '../socket';

interface LinesI {
  tool: string;
  points: any[];
}

export const Board = () => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<LinesI[]>([]);
  const isDrawing = useRef(false);

  useEffect(() => {
    socket.on('new line segment', (lineSegment: LinesI) => {
      setLines((lines) => [...lines, lineSegment]);
    });
    socket.on('clear board', () => {
      setLines([]);
    });

    return () => {
      socket.off('new line segment');
      socket.off('clear board');
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
    if (!e.target) {
      return;
    }
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());

    socket.emit('new line segment', lastLine);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearBoard = () => {
    setLines([]);

    socket.emit('clear board');
  };

  return (
    <div>
      <button type='button' onClick={clearBoard}>
        Clear board
      </button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text='Just start drawing' x={5} y={30} />
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
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value='pen'>Pen</option>
        <option value='eraser'>Eraser</option>
      </select>
    </div>
  );
};
