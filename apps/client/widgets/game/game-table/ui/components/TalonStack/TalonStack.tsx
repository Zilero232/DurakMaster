'use client';

import { isRedSuit, suitSymbol } from '@/shared/lib/cards';
import { PlayingCard } from '@/shared/ui';

import s from './TalonStack.module.scss';

import type { Card, Suit } from '@durak-master/schemas';

type TalonStackProps = {
  count: number;
  trump: Suit;
  /** Козырная карта под колодой. `null`, когда колода разобрана. */
  trumpCard: Card | null;
};

export const TalonStack = ({ count, trump, trumpCard }: TalonStackProps) => (
  <div className={s.root}>
    <div className={s.stack}>
      {trumpCard && (
        // Козырь лежит под колодой поперёк — он уходит последним.
        <div className={s.trumpCard}>
          <PlayingCard card={trumpCard} />
        </div>
      )}

      {count > 0 && (
        <div className={s.back}>
          <PlayingCard card={null} />
          <span className={s.count}>{count}</span>
        </div>
      )}
    </div>

    <div className={s.trumpBadge} data-red={isRedSuit(trump)}>
      {suitSymbol(trump)}
    </div>
  </div>
);
