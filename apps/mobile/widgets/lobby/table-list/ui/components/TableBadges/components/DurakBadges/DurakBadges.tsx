import { ArrowLeftRight, Layers, Users, VenetianMask } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { DurakBadgesProps } from './DurakBadges.types';

import { BADGE_ICON_SIZE, styles } from '../../TableBadges.styles';

export const DurakBadges = ({ rules }: DurakBadgesProps) => {
  const { t } = useTranslation();

  const { deckSize, mode, throwInScope, fairness } = rules;

  return (
    <>
      <View style={styles.badge}>
        <Layers color={colors.mutedForeground} size={BADGE_ICON_SIZE} />
        <Text style={styles.label}>{deckSize}</Text>
      </View>

      <View style={styles.badge}>
        <ArrowLeftRight color={colors.mutedForeground} size={BADGE_ICON_SIZE} />
        <Text style={styles.label}>{t(`games.durak.mode.${mode}`)}</Text>
      </View>

      <View style={styles.badge}>
        <Users color={colors.mutedForeground} size={BADGE_ICON_SIZE} />
        <Text style={styles.label}>{t(`games.durak.throwInScope.${throwInScope}`)}</Text>
      </View>

      {fairness === 'cheaters' && (
        <View style={[styles.badge, styles.cheaters]}>
          <VenetianMask color={colors.primaryForeground} size={BADGE_ICON_SIZE} />

          <Text style={[styles.label, styles.cheatersLabel]}>
            {t('games.durak.fairness.cheaters')}
          </Text>
        </View>
      )}
    </>
  );
};
