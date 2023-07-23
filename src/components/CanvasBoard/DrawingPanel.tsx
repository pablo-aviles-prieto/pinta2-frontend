import { FC } from 'react';
import { CirclePicker } from 'react-color';
import { DrawEraser, DrawPencil } from '../Icons';
import { getBase64SVGURL } from '../../utils';
import { PALETTE_COLORS } from '../../utils/const';

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

const MIN_WIDTH_STROKE = 4;
const MAX_WIDTH_STROKE = 9;

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
  const onToolChange = ({
    tool,
    color,
  }: {
    tool: SwappedTool;
    color: string;
  }) => {
    const cursorDataURL = getBase64SVGURL(color);
    const cursorStyle =
      tool === 'pen'
        ? `url(${cursorDataURL}) 5 5,  auto`
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
        colors={PALETTE_COLORS}
        onChange={(color) => {
          onToolChange({ tool: 'pen', color: color.hex });
          setColor(color.hex);
        }}
      />
      <div className='flex gap-2'>
        <input
          className='slider-vertical h-[100px] w-[8px] px-2'
          type='range'
          min={MIN_WIDTH_STROKE}
          max={MAX_WIDTH_STROKE}
          value={stroke}
          onChange={(e) => setStroke(Number(e.target.value))}
        />
        <div className='text-xs font-bold h-[100px] flex flex-col-reverse items-center'>
          {[...Array(MAX_WIDTH_STROKE - MIN_WIDTH_STROKE + 1).keys()].map(
            (i) => (
              <div
                className='block w-6 my-[6px]'
                key={i}
                style={{
                  borderTop: `${i + 2}px solid black`,
                }}
              />
            )
          )}
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <div
          className={`flex justify-between rounded-md shadow-lg hover:shadow-inner ${
            tool === 'pen' && 'shadow-sm'
          }`}
        >
          <button onClick={() => onToolChange({ tool: 'pen', color })}>
            <DrawPencil width={45} height={40} />
          </button>
        </div>
        <div
          className={`flex justify-center rounded-md shadow-lg hover:shadow-inner ${
            tool === 'eraser' && 'shadow-sm'
          }`}
        >
          <button onClick={() => onToolChange({ tool: 'eraser', color })}>
            <DrawEraser width={45} height={40} />
          </button>
        </div>
      </div>
    </div>
  );
};
