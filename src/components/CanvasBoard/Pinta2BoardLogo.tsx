import { Layer, Text } from 'react-konva';
import { LOGO_COLORS_CLASSES_HEX } from '../../utils/const';

const X_POSITION = 175;
const Y_POSITION = 235;
const DEFAULT_SPACE_BETWEEN_CHARS = 75;

const LOGO_NAME = 'Pinta2';

export const Pinta2BoardLogo = () => {
  return (
    <Layer>
      {LOGO_NAME.split('').map((character, i) => {
        const spaceBetweenChars =
          character === 'i'
            ? 107
            : character === 't'
            ? 80
            : character === '2'
            ? 70
            : DEFAULT_SPACE_BETWEEN_CHARS;
        return (
          <Text
            key={character}
            x={X_POSITION + spaceBetweenChars * i}
            y={character === 'P' ? 195 : character === '2' ? 195 : Y_POSITION}
            text={character}
            fontFamily='Finger Paint'
            fontSize={character === '2' ? 230 : character === 'P' ? 170 : 150}
            fill={
              LOGO_COLORS_CLASSES_HEX[
                character.toLowerCase() as keyof typeof LOGO_COLORS_CLASSES_HEX
              ]
            }
            opacity={0.05}
            rotation={character === '2' ? -18 : 0}
          />
        );
      })}
    </Layer>
  );
};
