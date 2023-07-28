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
        : `url('../../../public/svgs/eraser-tool.svg') 1 19, auto`;
    setCanvasCursorStyle(cursorStyle);
    setTool(tool);
  };

  return (
    <div
      className='z-[1] absolute top-0 left-[200px] h-[280px] w-[410px]'
      style={{
        backgroundImage: 'url(../../../public/imgs/painter-palette.webp)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='relative'>
        <CirclePicker
          className='absolute items-center justify-center top-[48px] left-[95px]'
          circleSize={30}
          circleSpacing={6}
          color={color}
          colors={PALETTE_COLORS}
          onChange={(color) => {
            onToolChange({ tool: 'pen', color: color.hex });
            setColor(color.hex);
          }}
        />
        <div className='absolute flex gap-2 top-[122px] left-[101px]'>
          <input
            className='slider-vertical h-[102px] w-[8px] px-2'
            type='range'
            min={
              tool === 'pen' ? MIN_PEN_WIDTH_STROKE : MIN_ERASER_WIDTH_STROKE
            }
            max={
              tool === 'pen' ? MAX_PEN_WIDTH_STROKE : MAX_ERASER_WIDTH_STROKE
            }
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
        <div className='absolute top-[120px] left-[180px] flex flex-col justify-between'>
          <div className={`flex justify-between mb-2`}>
            <button onClick={() => onToolChange({ tool: 'pen', color })}>
              <DrawPencil
                width={tool === 'eraser' ? 45 : 60}
                height={tool === 'eraser' ? 40 : 55}
              />
            </button>
          </div>
          <div className={`flex justify-center`}>
            <button onClick={() => onToolChange({ tool: 'eraser', color })}>
              <DrawEraser
                width={tool === 'eraser' ? 60 : 45}
                height={tool === 'eraser' ? 55 : 40}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
