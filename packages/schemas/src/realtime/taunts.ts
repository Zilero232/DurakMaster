import { z } from 'zod';

export const TAUNT_IDS = [
  'laugh',
  'cry',
  'smug',
  'bored',
  'shades',
  'wink',
  'angry',
  'shock',
  'sleep',
  'think',
  'kiss',
  'tongue',
  'money',
  'devil',
  'popcorn',
  'clown'
] as const;

export const tauntIdSchema = z.enum(TAUNT_IDS);

export type TauntId = z.infer<typeof tauntIdSchema>;
