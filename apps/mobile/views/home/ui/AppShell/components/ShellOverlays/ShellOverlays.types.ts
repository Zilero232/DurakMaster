import type { MyProfile } from '@durak-master/schemas';

import type { ShellPanel } from '../../../../model';

export type ShellOverlaysProps = {
  profile: MyProfile | null;

  openPanel: ShellPanel | null;
  isPasswordPromptOpen: boolean;
  onClosePanel: () => void;
  onClosePasswordPrompt: () => void;
  onSubmitPassword: (password: string) => void;
};
