import type { AvatarSeed, MyProfile } from '@durak-master/schemas';

export type ProfileDraft = {
  name: string;
  seed: AvatarSeed | null;
  pickedUri: string | null;
};

export type UseProfileDraftInput = {
  profile: MyProfile;
  onSaved: () => void;
};
