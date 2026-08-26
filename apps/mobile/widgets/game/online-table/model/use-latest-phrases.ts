import { useTranslation } from 'react-i18next';

import { useSessionStore } from '@/entities/session';
import { useNow } from '@/shared/lib/time';

const PHRASE_LIFETIME_MS = 3400;

export const useLatestPhrases = (): Record<string, string> => {
  const { t } = useTranslation();

  const phrases = useSessionStore((store) => store.phrases);

  const now = useNow(PHRASE_LIFETIME_MS / 4);

  const latest: Record<string, string> = {};

  for (const phrase of phrases) {
    if (now - phrase.sentAt < PHRASE_LIFETIME_MS) {
      latest[phrase.userId] = t(`phrases.${phrase.phraseId}`);
    }
  }

  return latest;
};
