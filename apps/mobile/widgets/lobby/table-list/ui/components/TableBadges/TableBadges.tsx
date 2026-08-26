import { ArrowLeftRight, Layers, Rabbit, Users, VenetianMask } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { TableBadgesProps } from './TableBadges.types';

import { styles } from './TableBadges.styles';

const ICON_SIZE = 13;

export const TableBadges = ({ settings }: TableBadgesProps) => {
  const { t } = useTranslation();

  const { deckSize, mode, throwInScope, fairness, speed } = settings;

  return (
    <View style={styles.root}>
      <View style={styles.badge}>
        <Layers color={colors.mutedForeground} size={ICON_SIZE} />
        <Text style={styles.label}>{deckSize}</Text>
      </View>

      <View style={styles.badge}>
        <ArrowLeftRight color={colors.mutedForeground} size={ICON_SIZE} />
        <Text style={styles.label}>{t(`create.mode.${mode}`)}</Text>
      </View>

      <View style={styles.badge}>
        <Users color={colors.mutedForeground} size={ICON_SIZE} />
        <Text style={styles.label}>{t(`create.mode.${throwInScope}`)}</Text>
      </View>

      {speed === 'fast' && (
        <View style={styles.badge}>
          <Rabbit color={colors.mutedForeground} size={ICON_SIZE} />
          <Text style={styles.label}>{t('create.speedFast')}</Text>
        </View>
      )}

      {fairness === 'cheaters' && (
        <View style={[styles.badge, styles.cheaters]}>
          <VenetianMask color={colors.primaryForeground} size={ICON_SIZE} />
          <Text style={[styles.label, styles.cheatersLabel]}>{t('create.mode.cheaters')}</Text>
        </View>
      )}
    </View>
  );
};
