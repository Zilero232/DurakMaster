import type { Chatter } from '../../../model';

export type SeatChatterProps = {
  chatter?: Chatter;
  size: number;

  /** Opponent seats sit above the felt, so their bubble hangs below to clear the cards. */
  placement?: 'above' | 'below';

  /** Height the seat's role line occupies, so a bubble below clears it. */
  clearance?: number;
};
