import { AVATAR_SEEDS, getRankInfo, toAvatarUrl } from '@durak-master/schemas';
import { ImagePlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button, colors, iconSize, Sheet } from '@/ui-kit';

import type { ProfileEditorProps } from './ProfileEditor.types';

import { useProfileDraft } from '../model';
import { AvatarChoice, AvatarPreview, NameField } from './components';
import { styles } from './ProfileEditor.styles';

export const ProfileEditor = ({ isOpen, profile, onClose }: ProfileEditorProps) => {
  const { t } = useTranslation();

  const { draft, isSaving, isNameValid, hasChanges, changeName, chooseSeed, pickImage, save } =
    useProfileDraft({ profile, onSaved: onClose });

  const rank = getRankInfo(profile.rating);

  const previewUrl = draft.pickedUri ?? (draft.seed ? toAvatarUrl(draft.seed) : profile.avatarUrl);

  return (
    <Sheet
      footer={
        <Button
          isFullWidth
          isDisabled={!hasChanges || !isNameValid}
          isLoading={isSaving}
          size='lg'
          variant='primary'
          onPress={() => {
            void save();
          }}
        >
          {t('common.save')}
        </Button>
      }
      isOpen={isOpen}
      title={t('profile.editTitle')}
      onClose={onClose}
    >
      <View style={styles.root}>
        <AvatarPreview
          avatarUrl={previewUrl}
          league={t(`profile.leagues.${rank.league.id}`)}
          level={rank.level}
          name={draft.name || profile.name}
        />

        <NameField value={draft.name} onChange={changeName} />

        <View style={styles.section}>
          <Text style={styles.label}>{t('profile.avatar')}</Text>

          <Pressable
            accessibilityRole='button'
            style={({ pressed }) => [styles.upload, pressed && styles.uploadPressed]}
            onPress={() => {
              void pickImage();
            }}
          >
            <ImagePlus color={colors.foreground} size={iconSize.sm} />

            <Text style={styles.uploadLabel}>
              {draft.pickedUri ? t('profile.photoChosen') : t('profile.uploadAvatar')}
            </Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />

            <Text style={styles.dividerLabel}>{t('profile.orPick')}</Text>

            <View style={styles.dividerLine} />
          </View>

          <View style={styles.grid}>
            {AVATAR_SEEDS.map((seed) => (
              <AvatarChoice
                key={seed}
                isSelected={seed === draft.seed}
                seed={seed}
                onSelect={chooseSeed}
              />
            ))}
          </View>
        </View>
      </View>
    </Sheet>
  );
};
