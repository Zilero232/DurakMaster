import { View } from 'react-native';

import type { AppLogoProps } from './AppLogo.types';

import { SuitIcon } from '../../icons';
import { colors } from '../../theme';
import { createStyles } from './AppLogo.styles';

export const AppLogo = ({ size = 40, style }: AppLogoProps) => {
  const styles = createStyles(size);

  return (
    <View style={[styles.root, style]}>
      <View style={styles.card} />

      <SuitIcon color={colors.goldBright} size={size * 0.58} suit='spades' />
    </View>
  );
};
