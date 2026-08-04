import type { Card } from '@durak-master/schemas';

export type PlayingCardProps = {
  /** Карта. `null` — рубашка (чужая рука, колода). */
  card: Card | null;
  /** Карту можно сыграть — подсвечивается и реагирует на наведение. */
  isPlayable?: boolean;
  /** Выбрана игроком. */
  isSelected?: boolean;
  /** Приглушена: ход не наш либо карта недоступна. */
  isDimmed?: boolean;
  /** Поворот в градусах — веер руки, наклон колоды. */
  rotation?: number;
  onClick?: () => void;
  className?: string;
};
