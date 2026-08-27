import { AVATAR_SEEDS, MAX_NAME_LENGTH, parseAvatarSeed } from '@durak-master/schemas';
import { ImagePlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { useSessionStore } from '@/entities/session';
import { Button, colors, iconSize, Sheet } from '@/ui-kit';

import type { ProfileEditorProps } from './ProfileEditor.types';

import { useAvatarUpload, useNameDraft } from '../model';
import { AvatarChoice } from './components';
import { styles } from './ProfileEditor.styles';

export const ProfileEditor = ({ isOpen, profile, onClose }: ProfileEditorProps) => {
  const { t } = useTranslation();

  const setAvatar = useSessionStore((store) => store.setAvatar);
  const setName = useSessionStore((store) => store.setName);

  const { draft, trimmed, canSave, setDraft } = useNameDraft(profile.name);
  const { isUploading, pick } = useAvatarUpload();

  const currentSeed = parseAvatarSeed(profile.avatarUrl);

  const saveName = () => {
    if (canSave) {
      setName(trimmed);
    }
  };

  return (
    <Sheet isOpen={isOpen} title={t('profile.editTitle')} onClose={onClose}>
      <View style={styles.root}>
        <View style={styles.section}>
          <Text style={styles.label}>{t('profile.name')}</Text>

          <View style={styles.nameRow}>
            <TextInput
              autoCapitalize='none'
              maxLength={MAX_NAME_LENGTH}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={colors.subtleForeground}
              returnKeyType='done'
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={saveName}
            />

            <Button isDisabled={!canSave} variant='primary' onPress={saveName}>
              {t('common.save')}
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('profile.avatar')}</Text>

          <Button
            isFullWidth
            isLoading={isUploading}
            variant='ghost'
            onPress={() => {
              void pick();
            }}
          >
            <ImagePlus color={colors.foreground} size={iconSize.sm} />

            {t('profile.uploadAvatar')}
          </Button>

          <View style={styles.grid}>
            {AVATAR_SEEDS.map((seed) => (
              <AvatarChoice
                key={seed}
                isSelected={seed === currentSeed}
                seed={seed}
                onSelect={setAvatar}
              />
            ))}
          </View>
        </View>
      </View>
    </Sheet>
  );
};
