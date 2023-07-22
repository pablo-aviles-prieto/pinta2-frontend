import { FC } from 'react';
import { CirclePicker } from 'react-color';
import { DrawEraser, DrawPencil } from '../Icons';

interface Props {
  color: string;
  stroke: number;
  tool: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setStroke: React.Dispatch<React.SetStateAction<number>>;
  setTool: React.Dispatch<React.SetStateAction<string>>;
  setCanvasCursorStyle: React.Dispatch<React.SetStateAction<string>>;
}

type SwappedTool = 'pen' | 'eraser';

const minWidthStroke = 4;
const maxWidthStroke = 9;

// TODO:? Add more width when eraser tool?
export const DrawingPanel: FC<Props> = ({
  color,
  stroke,
  tool,
  setColor,
  setStroke,
  setTool,
  setCanvasCursorStyle,
}) => {
  const onToolChange = (tool: SwappedTool) => {
    const cursorStyle =
      tool === 'pen'
        ? `url('../../../public/svgs/pencil-tool.svg') 5 5, auto`
        : `url('../../../public/svgs/eraser-tool.svg') 1 19, auto`;
    setCanvasCursorStyle(cursorStyle);
    setTool(tool);
  };

  return (
    <div className='z-10 absolute top-0 left-[200px] bg-stone-300 rounded-lg shadow-md p-2 flex gap-10'>
      <CirclePicker
        className='items-center justify-center'
        circleSize={30}
        circleSpacing={6}
        color={color}
        colors={[
          '#FF0000',
          '#FFA500',
          '#ffe600',
          '#008000',
          '#00FF00',
          '#40E0D0',
          '#0000FF',
          '#000080',
          '#800080',
          '#FF00FF',
          '#A52A2A',
          '#FFC0CB',
          '#808080',
          '#000000',
        ]}
        onChange={(color) => {
          onToolChange('pen');
          setColor(color.hex);
        }}
      />
      <div className='flex gap-2'>
        <input
          className='slider-vertical h-[100px] w-[8px] px-2'
          type='range'
          min={minWidthStroke}
          max={maxWidthStroke}
          value={stroke}
          onChange={(e) => setStroke(Number(e.target.value))}
        />
        <div className='text-xs font-bold h-[100px] flex flex-col-reverse items-center'>
          {[...Array(maxWidthStroke - minWidthStroke + 1).keys()].map((i) => (
            <div
              className='block w-6 my-[6px]'
              key={i}
              style={{
                borderTop: `${i + 2}px solid black`,
              }}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <div
          className={`flex justify-between rounded-md shadow-lg hover:shadow-inner ${
            tool === 'pen' && 'shadow-sm'
          }`}
        >
          <button onClick={() => onToolChange('pen')}>
            <DrawPencil width={45} height={40} />
          </button>
        </div>
        <div
          className={`flex justify-center rounded-md shadow-lg hover:shadow-inner ${
            tool === 'eraser' && 'shadow-sm'
          }`}
        >
          <button onClick={() => onToolChange('eraser')}>
            <DrawEraser width={45} height={40} />
          </button>
        </div>
      </div>
    </div>
  );
};
