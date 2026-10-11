import type { Card } from '@durak-master/schemas';

import { useCallback, useRef, useState } from 'react';

import type { DropZone } from '@/entities/game-table';

import { haptic } from '@/shared/lib/haptics';

import type { UseCardDragInput } from './use-card-drag.types';

import { MIN_ATTACK_TRAVEL } from '../../../config';

export const useCardDrag = ({
  onAttackWith,
  onDefendWith,
  onTransferWith,
  isDefending,
  beatableWith,
  canTransfer
}: UseCardDragInput) => {
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  const hoveredRef = useRef<number | null>(null);

  const hover = useCallback(
    (index: number | null) => {
      const target = isDefending ? index : null;

      if (hoveredRef.current === target) {
        return;
      }

      if (target !== null) {
        haptic('tap');
      }

      hoveredRef.current = target;
      setHoveredIndex(target);
    },
    [isDefending]
  );

  const start = useCallback((card: Card) => {
    setDraggedCard(card);
  }, []);

  const end = useCallback(() => {
    hoveredRef.current = null;
    setHoveredIndex(null);
    setDraggedCard(null);
  }, []);

  const dropOn = useCallback(
    (card: Card, pairIndex: number) => {
      end();

      if (!isDefending) {
        onAttackWith(card);

        return;
      }

      if (beatableWith(card).has(pairIndex)) {
        onDefendWith(pairIndex, card);

        return;
      }

      if (canTransfer(card)) {
        onTransferWith(card);
      }
    },
    [beatableWith, canTransfer, end, isDefending, onAttackWith, onDefendWith, onTransferWith]
  );

  const dropMissed = useCallback(
    (card: Card, travelY: number) => {
      end();

      const isThrownUp = travelY >= MIN_ATTACK_TRAVEL;

      if (!isDefending) {
        if (isThrownUp) {
          onAttackWith(card);
        }

        return;
      }

      const targets = beatableWith(card);

      if (targets.size === 1) {
        const [only] = targets;

        onDefendWith(only, card);

        return;
      }

      if (isThrownUp && canTransfer(card)) {
        onTransferWith(card);
      }
    },
    [beatableWith, canTransfer, end, isDefending, onAttackWith, onDefendWith, onTransferWith]
  );

  return {
    dropZones,
    hoveredIndex,

    targets: draggedCard ? beatableWith(draggedCard) : null,
    setDropZones,
    hover,
    start,
    end,
    dropOn,
    dropMissed
  };
};
