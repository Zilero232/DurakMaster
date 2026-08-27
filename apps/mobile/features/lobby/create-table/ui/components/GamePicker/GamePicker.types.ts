import type { GameId } from '@durak-master/schemas';

export type GamePickerProps = {
  value: GameId;
  onChange: (game: GameId) => void;
};
