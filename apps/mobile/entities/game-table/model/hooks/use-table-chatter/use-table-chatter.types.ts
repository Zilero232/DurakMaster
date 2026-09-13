import type { PlayerView, TablePhrase, TauntId } from '@durak-master/schemas';

export type UseTableChatterInput = {
  phrases: readonly TablePhrase[];
  emojis: Record<string, { emoji: TauntId; at: number }>;
  view?: PlayerView | null;
};
