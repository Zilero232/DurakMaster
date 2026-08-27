import type { MyProfile } from '@durak-master/schemas';

export type ProfileEditorProps = {
  isOpen: boolean;
  profile: MyProfile;
  onClose: () => void;
};
