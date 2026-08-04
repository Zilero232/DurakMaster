'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { useSettingsStore } from '@/entities/settings';
import { cardAssetUrl, cardBackUrl, getCardTheme } from '@/shared/lib/cards';

import s from './PlayingCard.module.scss';

import type { PlayingCardProps } from './PlayingCard.types';

export const PlayingCard = ({
  card,
  isPlayable = false,
  isSelected = false,
  isDimmed = false,
  rotation = 0,
  onClick,
  className,
}: PlayingCardProps) => {
  const t = useTranslations('card');
  const cardTheme = useSettingsStore((store) => store.cardTheme);

  const isFaceDown = card === null;
  // Рубашка зависит от темы, лицевая сторона общая — её красит CSS-фильтр.
  const src = isFaceDown ? cardBackUrl(getCardTheme(cardTheme).back) : cardAssetUrl(card);
  const label = isFaceDown
    ? t('faceDown')
    : t('label', { rank: t(`rank.${card.rank}`), suit: t(`suit.${card.suit}`) });

  return (
    <button
      type="button"
      className={clsx(
        s.root,
        isPlayable && s.playable,
        isSelected && s.selected,
        isDimmed && s.dimmed,
        className,
      )}
      style={{ '--card-rotation': `${rotation}deg` } as React.CSSProperties}
      disabled={!isPlayable}
      aria-label={label}
      aria-pressed={isSelected}
      onClick={onClick}
    >
      {/* Обычный <img>, а не inline SVG: инлайн раздул бы DOM до ~2000 узлов
          на 36 карт (порог предупреждения Lighthouse — 800).

          И не next/image: карты — статические SVG фиксированного размера,
          оптимизировать нечего, а в статическом экспорте для Tauri
          оптимизатор всё равно отключён (images.unoptimized). */}
      {/* biome-ignore lint/performance/noImgElement: SVG-спрайты, next/image не даёт выигрыша */}
      <img src={src} alt="" className={s.image} draggable={false} />
    </button>
  );
};
