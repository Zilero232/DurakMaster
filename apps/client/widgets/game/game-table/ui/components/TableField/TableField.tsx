'use client';

import clsx from 'clsx';

import { PlayingCard } from '@/shared/ui';

import s from './TableField.module.scss';

import type { TablePair } from '@durak-master/schemas';

type TableFieldProps = {
  pairs: TablePair[];
  /** Индексы пар, которые можно отбить выбранной картой. */
  beatableIndexes: Set<number>;
  onDefend: (pairIndex: number) => void;
};

export const TableField = ({ pairs, beatableIndexes, onDefend }: TableFieldProps) => {
  if (pairs.length === 0) {
    return (
      <div className={s.root}>
        <p className={s.empty}>Ход за атакующим</p>
      </div>
    );
  }

  return (
    <div className={s.root}>
      {pairs.map((pair, index) => {
        const canBeat = beatableIndexes.has(index);

        return (
          <div
            key={`${pair.attack.rank}:${pair.attack.suit}`}
            className={clsx(s.pair, canBeat && s.beatable)}
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
              <div className={s.defense}>
                <PlayingCard card={pair.defense} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
