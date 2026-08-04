/**
 * Компактная запись сумм: 1 200 000 → «1.2M».
 * Ставки в дураке доходят до десятков миллионов, полное число не читается.
 */
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

/** Полное число с разделителями разрядов — для профиля и кошелька. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

/** «5 игр», «2 игры», «1 игра» — русские правила склонения. */
export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }

  return many;
}

/** Оставшееся время хода в секундах. */
export function secondsLeft(deadline: number | null): number {
  if (!deadline) {
    return 0;
  }

  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}
