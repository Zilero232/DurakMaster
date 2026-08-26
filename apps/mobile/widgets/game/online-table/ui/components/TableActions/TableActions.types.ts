import type { QuickPhraseId } from '@durak-master/schemas';

export type TableActionsProps = {
  discardCount: number;
  canTake: boolean;
  canPass: boolean;
  onSendPhrase: (phraseId: QuickPhraseId) => void;
  onOpenDiscard: () => void;
  onOpenSettings: () => void;
  onTake: () => void;
  onPass: () => void;
};
