import { AVATAR_SEEDS, MAX_NAME_LENGTH, parseAvatarSeed } from '@durak-master/schemas';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { useSessionStore } from '@/entities/session';
import { Button, colors, Sheet } from '@/ui-kit';

import type { ProfileEditorProps } from './ProfileEditor.types';

import { AvatarChoice } from './components';
import { styles } from './ProfileEditor.styles';

const MIN_NAME_LENGTH = 2;

export const ProfileEditor = ({ isOpen, profile, onClose }: ProfileEditorProps) => {
  const { t } = useTranslation();

  const setAvatar = useSessionStore((store) => store.setAvatar);
  const setName = useSessionStore((store) => store.setName);

  const [nameDraft, setNameDraft] = useState(profile.name);

  const currentSeed = parseAvatarSeed(profile.avatarUrl);
  const trimmed = nameDraft.trim();
  const canSaveName = trimmed.length >= MIN_NAME_LENGTH && trimmed !== profile.name;

  const saveName = () => {
    if (canSaveName) {
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
              value={nameDraft}
              onChangeText={setNameDraft}
              onSubmitEditing={saveName}
            />

            <Button isDisabled={!canSaveName} variant='primary' onPress={saveName}>
              {t('common.save')}
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('profile.avatar')}</Text>

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
