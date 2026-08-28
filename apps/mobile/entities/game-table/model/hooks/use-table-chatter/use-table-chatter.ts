import type { TablePhrase, TauntId } from '@durak-master/schemas';

import { useTranslation } from 'react-i18next';

import { useNow } from '@/shared/model/time';

import type { Chatter } from '../../../ui/components/SeatChatter';

const LIFETIME_MS = 3400;

type TableChatterInput = {
  phrases: readonly TablePhrase[];
  emojis: Record<string, { emoji: TauntId; at: number }>;
};

export const useTableChatter = ({
  phrases,
  emojis
}: TableChatterInput): Record<string, Chatter> => {
  const { t } = useTranslation();

  const now = useNow(LIFETIME_MS / 4);

  const latest: Record<string, Chatter> = {};

  for (const phrase of phrases) {
    if (now - phrase.sentAt < LIFETIME_MS) {
      latest[phrase.userId] = {
        kind: 'phrase',
        text: t(`phrases.${phrase.phraseId}`),
        sentAt: phrase.sentAt
      };
    }
  }

  for (const [userId, entry] of Object.entries(emojis)) {
    if (now - entry.at < LIFETIME_MS) {
      latest[userId] = { kind: 'taunt', taunt: entry.emoji, sentAt: entry.at };
    }
  }

  return latest;
};
