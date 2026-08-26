import { StyleSheet } from 'react-native';

import { cardSize, card as cardTokens, spacing } from '@/ui-kit';

const LIFT_ROOM = spacing[6];

export const createStyles = (width: number) =>
  StyleSheet.create({
    root: {
      flexDirection: 'row',
      justifyContent: 'center',
      minHeight: width / cardTokens.ratio + LIFT_ROOM,
      paddingTop: LIFT_ROOM,
      paddingLeft: width * 0.5
    },

    slot: {
      marginRight: width * cardTokens.overlap
    },

    lastSlot: {
      marginRight: 0
    }
  });

export const styles = createStyles(cardSize.width);
