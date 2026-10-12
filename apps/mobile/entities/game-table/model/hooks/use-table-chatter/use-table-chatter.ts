import { useTranslation } from 'react-i18next';

import { seatCalls } from '@/shared/lib/games';
import { useNow } from '@/shared/model/time';

import type { Chatter } from '../../chatter';
import type { UseTableChatterInput } from './use-table-chatter.types';

import { CHATTER_LIFETIME_MS } from '../../../config';

export const useTableChatter = ({
  phrases,
  emojis,
  view
}: UseTableChatterInput): Record<string, Chatter> => {
  const { t } = useTranslation();

  const now = useNow(CHATTER_LIFETIME_MS / 4);

  const latest: Record<string, Chatter> = {};

  const calls = seatCalls({ view, labels: { take: t('table.take'), pass: t('table.pass') } });

  for (const [userId, call] of Object.entries(calls)) {
    latest[userId] = { id: `call:${call.kind}`, kind: 'phrase', text: call.text };
  }

  for (const phrase of phrases) {
    if (now - phrase.sentAt < CHATTER_LIFETIME_MS) {
      latest[phrase.userId] = {
        id: `phrase:${phrase.sentAt}`,
        kind: 'phrase',
        text: t(`phrases.${phrase.phraseId}`)
      };
    }
  }

  for (const [userId, entry] of Object.entries(emojis)) {
    if (now - entry.at < CHATTER_LIFETIME_MS) {
      latest[userId] = { id: `taunt:${entry.at}`, kind: 'taunt', taunt: entry.emoji };
    }
  }

  return latest;
};
