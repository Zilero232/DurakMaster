import type { QuickPhraseId, TauntId } from '@durak-master/schemas';

export type TableEmojisProps = {
  isOpen: boolean;
  onClose: () => void;
  onSendEmoji: (emoji: TauntId) => void;
  onSendPhrase: (phraseId: QuickPhraseId) => void;
};
