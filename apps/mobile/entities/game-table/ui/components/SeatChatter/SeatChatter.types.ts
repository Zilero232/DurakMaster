import type { TauntId } from '@durak-master/schemas';

export type Chatter = {
  sentAt: number;
} & ({ kind: 'phrase'; text: string } | { kind: 'taunt'; taunt: TauntId });

export type SeatChatterProps = {
  chatter?: Chatter;
  size: number;
};
