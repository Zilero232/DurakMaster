import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions, View } from 'react-native';

import type { LobbyBackgroundProps } from './LobbyBackground.types';

import { colors, screenGradient } from '../../theme';
import { DriftingSuit } from './components';
import { SUIT_MARKS } from './LobbyBackground.config';
import { styles } from './LobbyBackground.styles';

export const LobbyBackground = ({ children, style, isStatic = false }: LobbyBackgroundProps) => {
  const { height, width } = useWindowDimensions();

  return (
    <LinearGradient colors={screenGradient} style={[styles.root, style]}>
      <View style={styles.layer}>
        {SUIT_MARKS.map((mark) => (
          <DriftingSuit
            key={mark.id}
            isStatic={isStatic}
            left={width * mark.left}
            mark={mark}
            top={height * mark.top}
          />
        ))}
      </View>

      <LinearGradient
        colors={[
          colors.backgroundDeep,
          colors.transparent,
          colors.transparent,
          colors.backgroundDeep
        ]}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0.5 }}
        style={styles.layer}
      />

      {children}
    </LinearGradient>
  );
};
