import type { QuickPhraseId, TablePhrase } from '@durak-master/schemas';

import { randomUUID } from 'node:crypto';

export const createTablePhrase = (userId: string, phraseId: QuickPhraseId): TablePhrase => ({
  id: randomUUID(),
  userId,
  phraseId,
  sentAt: Date.now()
});
