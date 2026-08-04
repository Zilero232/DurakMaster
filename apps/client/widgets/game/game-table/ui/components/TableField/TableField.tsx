'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { cardKey } from '@/shared/lib/cards';
import { PlayingCard } from '@/shared/ui';

import s from './TableField.module.scss';

import type { TableFieldProps } from './TableField.types';

/** Карта прилетает от края стола и слегка перелетает цель — как брошенная рукой. */
const ATTACK_MOTION = {
  initial: { y: -60, opacity: 0, rotate: -8, scale: 0.9 },
  animate: { y: 0, opacity: 1, rotate: 0, scale: 1 },
  exit: { y: 40, opacity: 0, scale: 0.85 },
  transition: { type: 'spring', stiffness: 420, damping: 28 },
} as const;

/** Карта защиты падает сверху с небольшим доворотом. */
const DEFENSE_MOTION = {
  initial: { y: -34, x: 10, opacity: 0, rotate: 14 },
  animate: { y: 0, x: 0, opacity: 1, rotate: 8 },
  transition: { type: 'spring', stiffness: 380, damping: 26 },
} as const;

export const TableField = ({ pairs, beatableIndexes, onDefend }: TableFieldProps) => {
  const t = useTranslations('table');

  if (pairs.length === 0) {
    return (
      <div className={s.root}>
        <p className={s.empty}>{t('attackerTurn')}</p>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <AnimatePresence mode="popLayout">
        {pairs.map((pair, index) => {
          const canBeat = beatableIndexes.has(index);

          return (
            <motion.div
              key={cardKey(pair.attack)}
              layout
              className={clsx(s.pair, canBeat && s.beatable)}
              {...ATTACK_MOTION}
            >
              <div className={s.attack}>
                <PlayingCard
                  card={pair.attack}
                  isPlayable={canBeat}
                  onClick={() => onDefend(index)}
                />
              </div>

              {pair.defense && (
                // Карта защиты кладётся поверх со смещением — так видно обе.
                <motion.div className={s.defense} {...DEFENSE_MOTION}>
                  <PlayingCard card={pair.defense} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
