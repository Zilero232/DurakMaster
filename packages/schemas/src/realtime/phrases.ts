import { z } from 'zod';

export const QUICK_PHRASES = [
  'hello',
  'goodGame',
  'wellPlayed',
  'goodLuck',
  'thanks',
  'sorry',
  'hurryUp',
  'oneMoment',
  'nice',
  'unlucky',
  'bye',
  'rematch'
] as const;

export const quickPhraseIdSchema = z.enum(QUICK_PHRASES);

export type QuickPhraseId = z.infer<typeof quickPhraseIdSchema>;
