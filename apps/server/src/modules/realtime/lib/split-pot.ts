export type PotShare = {
  userId: string;
  amount: number;
};

type Winner = {
  userId: string;
  outPlace: number | null;
};

const byOutPlace = (left: Winner, right: Winner): number =>
  (left.outPlace ?? Number.MAX_SAFE_INTEGER) - (right.outPlace ?? Number.MAX_SAFE_INTEGER);

export const splitPot = (pot: number, winners: Winner[]): PotShare[] => {
  if (winners.length === 0 || pot <= 0) {
    return winners.map((winner) => ({ userId: winner.userId, amount: 0 }));
  }

  const ranked = [...winners].sort(byOutPlace);

  const totalWeight = (ranked.length * (ranked.length + 1)) / 2;

  let handedOut = 0;

  return ranked.map((winner, index) => {
    const isLast = index === ranked.length - 1;
    const weight = ranked.length - index;

    const amount = isLast ? pot - handedOut : Math.floor((pot * weight) / totalWeight);

    handedOut += amount;

    return { userId: winner.userId, amount };
  });
};
