import { millisecondsToHours, millisecondsToMinutes, millisecondsToSeconds } from 'date-fns';

const pad = (value: number): string => String(value).padStart(2, '0');

export function formatCountdown(remainingMs: number): string {
  const total = Math.max(0, remainingMs);

  const hours = millisecondsToHours(total);
  const minutes = millisecondsToMinutes(total) % 60;
  const seconds = millisecondsToSeconds(total) % 60;

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

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
