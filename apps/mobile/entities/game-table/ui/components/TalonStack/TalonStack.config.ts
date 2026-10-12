const TALON_SCALE = 0.85;

const TRUMP_REVEAL_RATIO = 0.6;

export const SUIT_BADGE_SIZE = 16;

export const EMPTY_BADGE_SIZE = 22;

export const TRUMP_ROTATION = 90;

export type TalonLayout = {
  card: number;
  stack: { width: number; height: number };
  trumpCard: { top: number; left: number };
};

export type TalonLayoutInput = {
  cardWidth: number;
  cardHeight: number;
};

export const talonLayout = ({ cardWidth, cardHeight }: TalonLayoutInput): TalonLayout => {
  const width = cardWidth * TALON_SCALE;
  const height = cardHeight * TALON_SCALE;

  const reveal = width * TRUMP_REVEAL_RATIO;

  return {
    card: width,
    stack: { width: width + reveal, height },
    trumpCard: { top: (height - width) / 2, left: width - (height - reveal) }
  };
};
