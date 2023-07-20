import { FC } from 'react';
import { CirclePicker } from 'react-color';

interface Props {
  color: string;
  stroke: number;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setStroke: React.Dispatch<React.SetStateAction<number>>;
  setTool: React.Dispatch<React.SetStateAction<string>>;
}

const minWidthStroke = 4;
const maxWidthStroke = 9;

// TODO:? Add more width when eraser tool?
// Add SVG o webp for pen and eraser divs
export const DrawingPanel: FC<Props> = ({
  color,
  stroke,
  setColor,
  setStroke,
  setTool,
}) => {
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
          '#FFFF00',
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
            // <div key={i}>{i + 1}</div>
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
        <div className='py-2 border-2 border-blue-400'>
          <button onClick={() => setTool('pen')}>Lápiz</button>
        </div>
        <div className='py-2 border-2 border-blue-400'>
          <button onClick={() => setTool('eraser')}>Goma</button>
        </div>
      </div>
    </div>
  );
};
