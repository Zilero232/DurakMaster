import { StyleSheet } from 'react-native';

import { borderWidth, card, colors, fontSize, glow, spacing } from '@/ui-kit';

export const DEFENSE_OFFSET_RATIO = { x: 0.2, y: 0.18 } as const;

export const DEFENSE_ROTATION = 8;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[2]
  },

  empty: {
    width: '100%',
    paddingTop: spacing[6],
    fontSize: fontSize.sm,
    color: colors.onFeltMuted,
    textAlign: 'center'
  },

  attack: {
    position: 'absolute',
    top: 0,
    left: 0
  },

  beatable: {
    ...glow.accent
  },

  hovered: {
    ...glow.success
  }
});

export const createPairStyles = (width: number, height: number) => {
  const offsetX = width * DEFENSE_OFFSET_RATIO.x;
  const offsetY = height * DEFENSE_OFFSET_RATIO.y;

  return StyleSheet.create({
    pair: {
      width: width + offsetX,
      height: height + offsetY
    },

    defense: {
      position: 'absolute',
      top: offsetY,
      left: offsetX
    },

    dropHint: {
      position: 'absolute',
      top: offsetY,
      left: offsetX,
      width,
      height,
      borderWidth: borderWidth.regular,
      borderColor: colors.defense,
      borderStyle: 'dashed',
      borderRadius: card.radius,
      backgroundColor: colors.glass
    }
  });
};
