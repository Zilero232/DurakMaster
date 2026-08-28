export const nextFreeSeat = (takenSeats: number[]): number => {
  const taken = new Set(takenSeats);

  let seat = 0;

  while (taken.has(seat)) {
    seat += 1;
  }

  return seat;
};
