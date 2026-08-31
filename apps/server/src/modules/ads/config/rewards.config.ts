import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';

export const AD_SKIPS_PER_DAY = 4;

export const AD_SKIP_COOLDOWN_MS = minutesToMilliseconds(15);

export const AD_SKIP_WINDOW_MS = hoursToMilliseconds(24);
