import type { QuickPhraseId, TablePhrase } from '@durak-master/schemas';

import { randomUUID } from 'node:crypto';

import { PHRASE_HISTORY_LIMIT } from '../../config';

export class RoomChatter {
  private phrases: TablePhrase[] = [];

  add(userId: string, phraseId: QuickPhraseId): TablePhrase {
    const phrase: TablePhrase = {
      id: randomUUID(),
      userId,
      phraseId,
      sentAt: Date.now()
    };

    this.phrases = [...this.phrases.slice(-(PHRASE_HISTORY_LIMIT - 1)), phrase];

    return phrase;
  }

  history(): TablePhrase[] {
    return [...this.phrases];
  }
}
