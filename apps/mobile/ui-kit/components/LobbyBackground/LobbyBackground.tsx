import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions, View } from 'react-native';

import type { LobbyBackgroundProps } from './LobbyBackground.types';

import { SuitIcon } from '../../icons';
import { colors, screenGradient } from '../../theme';
import { SUIT_MARKS } from './LobbyBackground.config';
import { styles } from './LobbyBackground.styles';

export const LobbyBackground = ({ children, style }: LobbyBackgroundProps) => {
  const { height, width } = useWindowDimensions();

  return (
    <LinearGradient colors={screenGradient} style={[styles.root, style]}>
      <View style={styles.layer}>
        {SUIT_MARKS.map((mark) => (
          <SuitIcon
            key={mark.id}
            style={[
              styles.mark,
              {
                top: height * mark.top,
                left: width * mark.left,
                opacity: mark.opacity,
                transform: [{ rotate: `${mark.rotate}deg` }]
              }
            ]}
            color={colors.foreground}
            size={mark.size}
            suit={mark.suit}
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
