import { useTranslation } from 'react-i18next';

import type { Chatter } from '@/entities/game-table';

import { useSessionStore } from '@/entities/session';
import { useNow } from '@/shared/model/time';

const LIFETIME_MS = 3400;

export const useTableChatter = (): Record<string, Chatter> => {
  const { t } = useTranslation();

  const phrases = useSessionStore((store) => store.phrases);
  const emojis = useSessionStore((store) => store.emojis);

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
