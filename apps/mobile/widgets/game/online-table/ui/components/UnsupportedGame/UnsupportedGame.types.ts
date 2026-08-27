import type { GameId } from '@durak-master/schemas';

export type UnsupportedGameProps = {
  game: GameId;
  onLeave: () => void;
};
