import type { BoostId } from '@durak-master/schemas';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSessionStore } from '@/entities/session';
import { useAnimationSpeed, useSettingsStore } from '@/entities/settings';

import type { UseDurakTableInput } from './use-durak-table.types';

import { useCardDrag } from '../use-card-drag';

export const useDurakTable = ({ game }: UseDurakTableInput) => {
  const { t } = useTranslation();

  const sendPhrase = useSessionStore((store) => store.sendPhrase);
  const sendEmoji = useSessionStore((store) => store.sendEmoji);
  const profile = useSessionStore((store) => store.profile);
  const setReady = useSessionStore((store) => store.setReady);
  const currentTable = useSessionStore((store) => store.currentTable);
  const addBot = useSessionStore((store) => store.addBot);

  const showHints = useSettingsStore((store) => store.showHints);
  const handSort = useSettingsStore((store) => store.handSort);
  const cardScale = useSettingsStore((store) => store.cardScale);

  const { isInstant } = useAnimationSpeed();

  const drag = useCardDrag({
    isDefending: game.isDefending,
    beatableWith: game.beatableWith,
    onAttackWith: game.attackWith,
    onDefendWith: game.defendPairWith
  });

  const handleBoost = (boost: BoostId) => {
    toast(`${t(`boosts.${boost}`)} — ${t('common.soon')}`);
  };

  return {
    drag,
    profile,
    currentTable,
    cardScale,
    handSort,
    showHints,
    isInstant,
    sendEmoji,
    sendPhrase,
    setReady,
    addBot,
    handleBoost
  };
};
