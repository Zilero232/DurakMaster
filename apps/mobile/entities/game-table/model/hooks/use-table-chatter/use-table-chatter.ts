import type { PlayerView, TablePhrase, TauntId } from '@durak-master/schemas';

import { useTranslation } from 'react-i18next';

import { useNow } from '@/shared/model/time';

import type { Chatter } from '../../../ui/components/SeatChatter';

const LIFETIME_MS = 3400;

type TableChatterInput = {
  phrases: readonly TablePhrase[];
  emojis: Record<string, { emoji: TauntId; at: number }>;
  view?: PlayerView | null;
};

const seatCalls = (view: PlayerView | null | undefined, take: string, pass: string) => {
  const calls: Record<string, { text: string; sentAt: number }> = {};

  if (!view || view.game !== 'durak' || view.phase !== 'playing') {
    return calls;
  }

  for (const player of view.players) {
    if (view.isTaking && player.seat === view.defenderSeat) {
      calls[player.userId] = { text: take, sentAt: view.defenderSeat };
    } else if (view.passedSeats.includes(player.seat)) {
      calls[player.userId] = { text: pass, sentAt: view.passedSeats.indexOf(player.seat) };
    }
  }

  return calls;
};

export const useTableChatter = ({
  phrases,
  emojis,
  view
}: TableChatterInput): Record<string, Chatter> => {
  const { t } = useTranslation();

  const now = useNow(LIFETIME_MS / 4);

  const latest: Record<string, Chatter> = {};

  const calls = seatCalls(view, t('table.take'), t('table.calledPass'));

  for (const [userId, call] of Object.entries(calls)) {
    latest[userId] = { kind: 'phrase', text: call.text, sentAt: call.sentAt };
  }

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
