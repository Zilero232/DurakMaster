import type { TauntId } from '@durak-master/schemas';

export type Chatter = {
  /** Changes with every new line, so the bubble enters again instead of swapping text. */
  id: string;
} & ({ kind: 'phrase'; text: string } | { kind: 'taunt'; taunt: TauntId });
