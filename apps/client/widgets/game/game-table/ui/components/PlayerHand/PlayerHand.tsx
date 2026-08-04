'use client';

import { RANKS } from '@durak-master/schemas';

import { useSettingsStore } from '@/entities/settings';
import { PlayingCard } from '@/shared/ui';

import s from './PlayerHand.module.scss';

import type { Card, Suit } from '@durak-master/schemas';

type PlayerHandProps = {
  cards: Card[];
  /** Ключи карт (`rank:suit`), которыми сейчас можно сходить. */
  playableKeys: Set<string>;
  selectedKey: string | null;
  /** Козырь — козырные карты собираются в конце веера. */
  trump: Suit;
  onSelect: (card: Card) => void;
};

/** Максимальный разворот веера. Больше — карты перекрывают друг друга неудобно. */
const MAX_FAN_ANGLE = 24;

/** Порядок мастей внутри некозырной части — просто чтобы он был стабильным. */
const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  hearts: 1,
  diamonds: 2,
  clubs: 3,
};

/** Сравнение для сортировки руки: некозырные по мастям, козыри в конце. */
const createComparator =
  (trump: Suit) =>
  (a: Card, b: Card): number => {
    const aTrump = a.suit === trump;
    const bTrump = b.suit === trump;

    if (aTrump !== bTrump) {
      return aTrump ? 1 : -1;
    }

    if (a.suit !== b.suit) {
      return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
    }

    return RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
  };

export const PlayerHand = ({
  cards,
  playableKeys,
  selectedKey,
  trump,
  onSelect,
}: PlayerHandProps) => {
  // Подсказки отключаемы: опытным игрокам подсветка мешает считать самим.
  const showHints = useSettingsStore((store) => store.showHints);

  /**
   * Рука всегда отсортирована: козыри справа, внутри масти — по старшинству.
   *
   * Сервер присылает карты в порядке добора, и без сортировки каждая новая
   * карта втыкается в случайное место — игрок теряет привычную раскладку
   * ровно в тот момент, когда ему надо быстро принять решение.
   */
  const sorted = [...cards].sort(createComparator(trump));
  const count = sorted.length;

  return (
    <div className={s.root}>
      {sorted.map((card, index) => {
        const key = `${card.rank}:${card.suit}`;
        // Веер: карты раскладываются симметрично относительно центра.
        const offset = count > 1 ? index / (count - 1) - 0.5 : 0;
        const rotation = offset * MAX_FAN_ANGLE;

        return (
          <div
            key={key}
            className={s.slot}
            style={{
              transform: `translateY(${Math.abs(offset) * 14}px)`,
              // Явный порядок слоёв: каждая следующая карта выше предыдущей.
              // Без этого нижняя часть карты остаётся под соседом и не кликается.
              zIndex: index,
            }}
          >
            <PlayingCard
              card={card}
              rotation={rotation}
              // Кликабельность НЕ зависит от подсказок: выключенная подсветка
              // прячет ход, но не запрещает его — иначе настройка ломала бы игру.
              isPlayable={playableKeys.has(key)}
              isSelected={selectedKey === key}
              isDimmed={showHints && playableKeys.size > 0 && !playableKeys.has(key)}
              onClick={() => onSelect(card)}
            />
          </div>
        );
      })}
    </div>
  );
};
