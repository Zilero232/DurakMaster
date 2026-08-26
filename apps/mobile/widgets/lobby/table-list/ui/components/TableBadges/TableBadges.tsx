import { Rabbit } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { TableBadgesProps } from './TableBadges.types';

import { DurakBadges } from './components';
import { GAME_ICONS } from './TableBadges.config';
import { BADGE_ICON_SIZE, styles } from './TableBadges.styles';

export const TableBadges = ({ settings }: TableBadgesProps) => {
  const { t } = useTranslation();

  const GameIcon = GAME_ICONS[settings.game];

  return (
    <View style={styles.root}>
      <View style={[styles.badge, styles.gameBadge]}>
        <GameIcon color={colors.accent} size={BADGE_ICON_SIZE} />
        <Text style={[styles.label, styles.gameLabel]}>{t(`games.${settings.game}.name`)}</Text>
      </View>

      {settings.game === 'durak' && <DurakBadges rules={settings.rules} />}

      {settings.speed === 'fast' && (
        <View style={styles.badge}>
          <Rabbit color={colors.mutedForeground} size={BADGE_ICON_SIZE} />
          <Text style={styles.label}>{t('create.speedFast')}</Text>
        </View>
      )}
    </View>
  );
};
