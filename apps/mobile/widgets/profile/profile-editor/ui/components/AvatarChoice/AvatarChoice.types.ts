import type { AvatarSeed } from '@durak-master/schemas';

export type AvatarChoiceProps = {
  seed: AvatarSeed;
  isSelected: boolean;
  onSelect: (seed: AvatarSeed) => void;
};
