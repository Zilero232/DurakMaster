import type { QuickPhraseId } from '@durak-master/schemas';

export type TableEmojisProps = {
  isOpen: boolean;
  onClose: () => void;
  onSendEmoji: (emoji: string) => void;
  onSendPhrase: (phraseId: QuickPhraseId) => void;
};
