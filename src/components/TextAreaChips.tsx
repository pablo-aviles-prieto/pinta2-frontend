import { FC } from 'react';
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';

interface Props {
  introducedWords: string[];
  hasError?: boolean;
  setIntroducedWords: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TextAreaChips: FC<Props> = ({
  introducedWords,
  hasError,
  setIntroducedWords,
}) => {
  const handleChange = (newValue: MuiChipsInputChip[]) => {
    setIntroducedWords(newValue);
  };

  return (
    <MuiChipsInput
      className='w-full'
      label='Introduzca las palabras con las que jugar'
      value={introducedWords}
      onChange={handleChange}
      autoFocus
      placeholder=''
      error={hasError}
      color='success'
      hideClearAll
    />
  );
};
