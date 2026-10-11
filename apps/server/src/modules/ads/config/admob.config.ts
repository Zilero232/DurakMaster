import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';

export const ADMOB_VERIFIER_KEYS_URL = 'https://www.gstatic.com/admob/reward/verifier-keys.json';

export const ADMOB_KEYS_TTL_MS = hoursToMilliseconds(24);

export const ADMOB_KEYS_REFETCH_COOLDOWN_MS = minutesToMilliseconds(1);
