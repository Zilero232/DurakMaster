import { useTranslation } from 'react-i18next';

import { useSessionStore } from '@/entities/session';
import { useNow } from '@/shared/model/time';

const LIFETIME_MS = 3400;

export const useTableChatter = (): Record<string, string> => {
  const { t } = useTranslation();

  const phrases = useSessionStore((store) => store.phrases);
  const emojis = useSessionStore((store) => store.emojis);

  const now = useNow(LIFETIME_MS / 4);

  const latest: Record<string, string> = {};

  for (const phrase of phrases) {
    if (now - phrase.sentAt < LIFETIME_MS) {
      latest[phrase.userId] = t(`phrases.${phrase.phraseId}`);
    }
  }

  for (const [userId, entry] of Object.entries(emojis)) {
    if (now - entry.at < LIFETIME_MS) {
      latest[userId] = entry.emoji;
    }
  }

  return latest;
};
