import type { QuickPhraseId } from '@durak-master/schemas';

export type QuickPhrasesProps = {
  onSend: (phraseId: QuickPhraseId) => void;
};
