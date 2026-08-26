import { StyleSheet } from 'react-native';

import { cardSize, colors, fontSize, shadows, spacing } from '@/ui-kit';

export const DEFENSE_OFFSET_X = cardSize.width * 0.2;
export const DEFENSE_OFFSET_Y = cardSize.height * 0.18;

export const DEFENSE_ROTATION = 8;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[3]
  },

  empty: {
    width: '100%',
    paddingTop: spacing[6],
    fontSize: fontSize.sm,
    color: colors.onFeltMuted,
    textAlign: 'center'
  },

  pair: {
    width: cardSize.width + DEFENSE_OFFSET_X,
    height: cardSize.height + DEFENSE_OFFSET_Y
  },

  attack: {
    position: 'absolute',
    top: 0,
    left: 0
  },

  beatable: {
    boxShadow: '0px 0px 10px rgba(225, 175, 59, 0.9)',
    elevation: 10
  },

  defense: {
    position: 'absolute',
    top: DEFENSE_OFFSET_Y,
    left: DEFENSE_OFFSET_X,
    ...shadows.cardRaised
  }
});
