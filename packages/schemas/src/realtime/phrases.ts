import { z } from 'zod';

/**
 * Готовые фразы за столом.
 *
 * Свободный чат в карточной игре — это модерация, фильтр мата, жалобы
 * и риск для возрастного рейтинга. Фиксированный набор снимает всё это
 * разом: сервер пересылает только идентификатор, а текст подставляется
 * на языке получателя.
 *
 * Набор намеренно доброжелательный: злорадные реплики провоцируют
 * токсичность и не дают ничего, кроме неё.
 */
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
  'rematch',
] as const;

export const quickPhraseIdSchema = z.enum(QUICK_PHRASES);

export type QuickPhraseId = z.infer<typeof quickPhraseIdSchema>;
