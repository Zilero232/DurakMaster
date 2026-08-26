import type { Card } from '@durak-master/schemas';

import { useCallback, useRef, useState } from 'react';

import type { DropZone } from '@/entities/game-table';

import { haptic } from '@/shared/lib/haptics';

type UseCardDragInput = {
  onDefendWith: (pairIndex: number, card: Card) => void;

  onAttackWith: (card: Card) => void;

  isDefending: boolean;

  beatableWith: (card: Card) => Set<number>;
};

export const useCardDrag = ({
  onDefendWith,
  onAttackWith,
  isDefending,
  beatableWith
}: UseCardDragInput) => {
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  const hoveredRef = useRef<number | null>(null);

  const hover = useCallback((index: number | null) => {
    if (hoveredRef.current === index) {
      return;
    }

    if (index !== null) {
      haptic('tap');
    }

    hoveredRef.current = index;
    setHoveredIndex(index);
  }, []);

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
      onDefendWith(pairIndex, card);
    },
    [end, onDefendWith]
  );

  const dropMissed = useCallback(
    (card: Card) => {
      end();

      if (!isDefending) {
        onAttackWith(card);

        return;
      }

      const targets = beatableWith(card);

      if (targets.size === 1) {
        const [only] = targets;

        onDefendWith(only, card);
      }
    },
    [beatableWith, end, isDefending, onAttackWith, onDefendWith]
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
