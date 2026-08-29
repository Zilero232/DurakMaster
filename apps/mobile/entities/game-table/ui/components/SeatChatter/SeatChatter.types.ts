import type { TauntId } from '@durak-master/schemas';

export type Chatter = {
  sentAt: number;
} & ({ kind: 'phrase'; text: string } | { kind: 'taunt'; taunt: TauntId });

export type SeatChatterProps = {
  chatter?: Chatter;
  size: number;

  /** Opponent seats sit above the felt, so their bubble hangs below to clear the cards. */
  placement?: 'above' | 'below';
};
