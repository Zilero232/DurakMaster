import { z } from 'zod';

import { quickPhraseIdSchema } from './phrases';

export const tablePhraseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phraseId: quickPhraseIdSchema,
  sentAt: z.number().int()
});

export type TablePhrase = z.infer<typeof tablePhraseSchema>;
