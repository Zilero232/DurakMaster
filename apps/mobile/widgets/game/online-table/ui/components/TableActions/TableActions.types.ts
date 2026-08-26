import type { BoostId, MyProfile, QuickPhraseId } from '@durak-master/schemas';

export type TableActionsProps = {
  profile: MyProfile | null;

  chatter?: string;
  isMyTurn: boolean;
  turnDeadline: number | null;
  turnSeconds: number;
  canTake: boolean;
  canPass: boolean;
  onSendEmoji: (emoji: string) => void;
  onSendPhrase: (phraseId: QuickPhraseId) => void;
  onUseBoost: (boost: BoostId) => void;
  onTake: () => void;
  onPass: () => void;

  onLeave: () => void;
};
