import type { Suit } from '@durak-master/schemas';

export type SuitMark = {
  id: string;
  suit: Suit;
  top: number;
  left: number;
  size: number;
  rotate: number;
  opacity: number;
};

export const SUIT_MARKS: SuitMark[] = [
  { id: 'spade-1', suit: 'spades', top: 0.04, left: 0.76, size: 138, rotate: 18, opacity: 0.05 },
  { id: 'heart-1', suit: 'hearts', top: 0.02, left: 0.28, size: 74, rotate: -12, opacity: 0.035 },
  { id: 'club-1', suit: 'clubs', top: 0.1, left: 0.05, size: 96, rotate: 24, opacity: 0.04 },
  { id: 'diamond-1', suit: 'diamonds', top: 0.16, left: 0.52, size: 62, rotate: 8, opacity: 0.03 },
  { id: 'heart-2', suit: 'hearts', top: 0.19, left: -0.07, size: 172, rotate: -22, opacity: 0.045 },
  { id: 'spade-2', suit: 'spades', top: 0.24, left: 0.88, size: 88, rotate: -16, opacity: 0.035 },
  { id: 'club-2', suit: 'clubs', top: 0.32, left: 0.34, size: 110, rotate: 14, opacity: 0.03 },
  { id: 'diamond-2', suit: 'diamonds', top: 0.4, left: 0.7, size: 82, rotate: -20, opacity: 0.04 },
  { id: 'spade-3', suit: 'spades', top: 0.44, left: 0.12, size: 68, rotate: 30, opacity: 0.03 },
  {
    id: 'diamond-3',
    suit: 'diamonds',
    top: 0.48,
    left: 0.84,
    size: 152,
    rotate: 12,
    opacity: 0.045
  },
  { id: 'heart-3', suit: 'hearts', top: 0.55, left: 0.46, size: 94, rotate: -10, opacity: 0.03 },
  { id: 'club-3', suit: 'clubs', top: 0.62, left: -0.06, size: 144, rotate: -14, opacity: 0.045 },
  { id: 'spade-4', suit: 'spades', top: 0.68, left: 0.62, size: 76, rotate: 22, opacity: 0.03 },
  { id: 'heart-4', suit: 'hearts', top: 0.74, left: 0.24, size: 66, rotate: -26, opacity: 0.035 },
  { id: 'club-4', suit: 'clubs', top: 0.8, left: 0.9, size: 104, rotate: 16, opacity: 0.035 },
  { id: 'spade-5', suit: 'spades', top: 0.85, left: 0.66, size: 122, rotate: 26, opacity: 0.04 },
  { id: 'diamond-4', suit: 'diamonds', top: 0.9, left: 0.4, size: 72, rotate: -18, opacity: 0.03 },
  { id: 'heart-5', suit: 'hearts', top: 0.93, left: 0.08, size: 112, rotate: -8, opacity: 0.04 }
];
