import type { BoostId } from '@durak-master/schemas';

import { useSessionStore } from '@/entities/session';
import { useAnimationSpeed, useSettingsStore } from '@/entities/settings';

import type { UseDurakTableInput } from './use-durak-table.types';

import { useCardDrag } from '../use-card-drag';

export const useDurakTable = ({ game }: UseDurakTableInput) => {
  const sendPhrase = useSessionStore((store) => store.sendPhrase);
  const sendEmoji = useSessionStore((store) => store.sendEmoji);
  const profile = useSessionStore((store) => store.profile);
  const setReady = useSessionStore((store) => store.setReady);
  const currentTable = useSessionStore((store) => store.currentTable);
  const addBot = useSessionStore((store) => store.addBot);
  const applyBoost = useSessionStore((store) => store.applyBoost);

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
    applyBoost(boost);
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
