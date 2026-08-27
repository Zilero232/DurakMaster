import { useBoolean } from '@siberiacancode/reactuse';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSessionStore } from '@/entities/session';

import { uploadAvatar } from '../../../api';
import { AVATAR_UPLOAD_QUALITY, AVATAR_UPLOAD_SIZE } from '../../../config';

export const useAvatarUpload = () => {
  const { t } = useTranslation();

  const setProfile = useSessionStore((store) => store.setProfile);

  const [isUploading, toggleUploading] = useBoolean(false);

  const pick = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (picked.canceled || !picked.assets[0]) {
      return;
    }

    toggleUploading(true);

    try {
      const context = ImageManipulator.manipulate(picked.assets[0].uri);

      context.resize({ width: AVATAR_UPLOAD_SIZE, height: AVATAR_UPLOAD_SIZE });

      const image = await context.renderAsync();
      const resized = await image.saveAsync({
        compress: AVATAR_UPLOAD_QUALITY,
        format: SaveFormat.JPEG
      });

      setProfile(await uploadAvatar(resized.uri));
    } catch {
      toast.error(t('profile.avatarUploadFailed'));
    } finally {
      toggleUploading(false);
    }
  };

  return { isUploading, pick };
};
