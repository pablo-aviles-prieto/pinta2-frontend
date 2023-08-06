import { FC } from 'react';
import { CirclePicker } from 'react-color';
import { DrawEraser, DrawPencil } from '../Icons';
import { getBase64SVGURL } from '../../utils';
import { PALETTE_COLORS } from '../../utils/const';

interface Props {
  color: string;
  pencilStroke: number;
  eraserStroke: number;
  tool: 'pen' | 'eraser';
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setPencilStroke: React.Dispatch<React.SetStateAction<number>>;
  setEraserStroke: React.Dispatch<React.SetStateAction<number>>;
  setTool: React.Dispatch<React.SetStateAction<'pen' | 'eraser'>>;
  setCanvasCursorStyle: React.Dispatch<React.SetStateAction<string>>;
}

type SwappedTool = 'pen' | 'eraser';

const MIN_PEN_WIDTH_STROKE = 5;
const MAX_PEN_WIDTH_STROKE = 10;
const MIN_ERASER_WIDTH_STROKE = 15;
const MAX_ERASER_WIDTH_STROKE = 20;

export const DrawingPanel: FC<Props> = ({
  color,
  pencilStroke,
  eraserStroke,
  tool,
  setColor,
  setPencilStroke,
  setEraserStroke,
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
        : `url('/svgs/eraser-tool.svg') 1 19, auto`;
    setCanvasCursorStyle(cursorStyle);
    setTool(tool);
  };

  return (
    <div className='flex p-2 border-2 rounded-lg shadow-md gap-9 border-emerald-300 bg-gradient-to-tl from-amber-50 via-orange-50 to-amber-100'>
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
          className='slider-vertical h-[102px] w-[8px] px-2'
          type='range'
          min={tool === 'pen' ? MIN_PEN_WIDTH_STROKE : MIN_ERASER_WIDTH_STROKE}
          max={tool === 'pen' ? MAX_PEN_WIDTH_STROKE : MAX_ERASER_WIDTH_STROKE}
          value={tool === 'pen' ? pencilStroke : eraserStroke}
          onChange={(e) =>
            tool === 'pen'
              ? setPencilStroke(Number(e.target.value))
              : setEraserStroke(Number(e.target.value))
          }
        />
        <div className='text-xs font-bold h-[102px] flex flex-col-reverse items-center'>
          {[
            ...Array(MAX_PEN_WIDTH_STROKE - MIN_PEN_WIDTH_STROKE + 1).keys(),
          ].map((i) => (
            <div
              className='block w-6 my-[6px]'
              key={i}
              style={{
                borderTop: `${i + 3}px solid black`,
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
