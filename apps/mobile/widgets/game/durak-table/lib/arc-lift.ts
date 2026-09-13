const ARC_LIFT = 8;

export type ArcLiftInput = {
  index: number;
  total: number;
};

export const arcLift = ({ index, total }: ArcLiftInput): number => {
  if (total < 3) {
    return 0;
  }

  const middle = (total - 1) / 2;

  return Math.round((1 - Math.abs(index - middle) / middle) * ARC_LIFT);
};
