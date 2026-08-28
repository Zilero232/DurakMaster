import type { AvatarSeed } from '@durak-master/schemas';

import { parseAvatarSeed } from '@durak-master/schemas';
import { useBoolean } from '@siberiacancode/reactuse';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSessionStore } from '@/entities/session';

import type { ProfileDraft, UseProfileDraftInput } from './use-profile-draft.types';

import { uploadAvatar } from '../../../api';
import { MIN_NAME_LENGTH } from '../../../config';
import { prepareAvatar } from '../../../lib';

const toDraft = (name: string, avatarUrl: string | null): ProfileDraft => ({
  name,
  seed: parseAvatarSeed(avatarUrl) as AvatarSeed | null,
  pickedUri: null
});

export const useProfileDraft = ({ profile, onSaved }: UseProfileDraftInput) => {
  const { t } = useTranslation();

  const setProfile = useSessionStore((store) => store.setProfile);
  const setAvatar = useSessionStore((store) => store.setAvatar);
  const setName = useSessionStore((store) => store.setName);

  const [draft, setDraft] = useState(() => toDraft(profile.name, profile.avatarUrl));
  const [source, setSource] = useState(profile);
  const [isSaving, toggleSaving] = useBoolean(false);

  if (source !== profile) {
    setSource(profile);
    setDraft(toDraft(profile.name, profile.avatarUrl));
  }

  const trimmedName = draft.name.trim();
  const savedSeed = parseAvatarSeed(profile.avatarUrl);

  const isNameValid = trimmedName.length >= MIN_NAME_LENGTH;
  const hasNameChange = isNameValid && trimmedName !== profile.name;
  const hasSeedChange = draft.seed !== null && draft.seed !== savedSeed;
  const hasImageChange = draft.pickedUri !== null;

  const pickImage = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (picked.canceled || !picked.assets[0]) {
      return;
    }

    setDraft((current) => ({ ...current, pickedUri: picked.assets[0].uri, seed: null }));
  };

  const save = async () => {
    toggleSaving(true);

    try {
      if (hasImageChange && draft.pickedUri) {
        setProfile(await uploadAvatar(await prepareAvatar(draft.pickedUri)));
      } else if (hasSeedChange && draft.seed) {
        setAvatar(draft.seed);
      }

      if (hasNameChange) {
        setName(trimmedName);
      }

      onSaved();
    } catch {
      toast.error(t('profile.saveFailed'));
    } finally {
      toggleSaving(false);
    }
  };

  return {
    draft,
    isSaving,
    isNameValid,
    hasChanges: hasNameChange || hasSeedChange || hasImageChange,
    changeName: (name: string) => setDraft((current) => ({ ...current, name })),
    chooseSeed: (seed: AvatarSeed) =>
      setDraft((current) => ({ ...current, seed, pickedUri: null })),
    pickImage,
    save
  };
};
