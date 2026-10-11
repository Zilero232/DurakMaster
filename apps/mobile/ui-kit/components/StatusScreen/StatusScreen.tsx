import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { StatusScreenProps } from './StatusScreen.types';

import { gradientEnds, surfaceGradient } from '../../theme';
import { LobbyBackground } from '../LobbyBackground';
import { styles, TONE_STYLES } from './StatusScreen.styles';

export const StatusScreen = ({
  icon,
  title,
  description,
  highlight,
  highlightTone = 'neutral',
  details,
  actions
}: StatusScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <LobbyBackground
      style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <LinearGradient
        colors={surfaceGradient.raised}
        end={gradientEnds.vertical.end}
        start={gradientEnds.vertical.start}
        style={styles.panel}
      >
        {icon && <View style={styles.icon}>{icon}</View>}

        <Text style={styles.title}>{title}</Text>

        {description && <Text style={styles.description}>{description}</Text>}

        {highlight && (
          <Text style={[styles.highlight, TONE_STYLES[highlightTone]]}>{highlight}</Text>
        )}

        {details && (
          <Text numberOfLines={4} style={styles.details}>
            {details}
          </Text>
        )}

        {actions && <View style={styles.actions}>{actions}</View>}
      </LinearGradient>
    </LobbyBackground>
  );
};
