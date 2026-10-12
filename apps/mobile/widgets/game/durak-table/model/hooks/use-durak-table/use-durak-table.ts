import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { useAnimationSpeed, useSettingsStore } from '@/entities/settings';
import { haptic } from '@/shared/lib/haptics';

import type { UseDurakTableInput } from './use-durak-table.types';

import { useCardDrag } from '../use-card-drag';

export const useDurakTable = ({ game }: UseDurakTableInput) => {
  const { t } = useTranslation();

  const sendPhrase = useSessionStore((store) => store.sendPhrase);
  const sendEmoji = useSessionStore((store) => store.sendEmoji);
  const setReady = useSessionStore((store) => store.setReady);
  const currentTable = useSessionStore((store) => store.currentTable);
  const addBot = useSessionStore((store) => store.addBot);
  const applyBoost = useSessionStore((store) => store.applyBoost);

  const showHints = useSettingsStore((store) => store.showHints);
  const handSort = useSettingsStore((store) => store.handSort);

  const { profile } = useMyProfile();

  const { isInstant } = useAnimationSpeed();

  const drag = useCardDrag({
    isDefending: game.isDefending,
    beatableWith: game.beatableWith,
    canTransfer: game.canTransfer,
    onAttackWith: game.attackWith,
    onDefendWith: game.defendPairWith,
    onTransferWith: game.transfer
  });

  const transferable = game.view?.hand.filter(game.canTransfer) ?? [];
  const canTransferNow = transferable.length > 0;

  const { selectedCard } = game;
  const selectedTransfer =
    selectedCard !== null && game.canTransfer(selectedCard) ? selectedCard : null;
  const [onlyTransferable = null] = transferable.length === 1 ? transferable : [];
  const transferCard = selectedTransfer ?? onlyTransferable;

  const transferToSlot = () => {
    if (transferCard === null) {
      haptic('error');
      toast(t('table.transferPick'));

      return;
    }

    game.transfer(transferCard);
  };

  return {
    drag,
    profile,
    currentTable,
    handSort,
    showHints,
    isInstant,
    canTransferNow,
    transferToSlot,
    sendEmoji,
    sendPhrase,
    setReady,
    addBot,
    applyBoost
  };
};
