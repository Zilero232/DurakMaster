export function formatCredits(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;

    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }

  if (value >= 1_000) {
    const thousands = value / 1_000;

    return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}K`;
  }

  return String(value);
}
