import { StyleSheet } from 'react-native';

import { CORNER_BUTTON_SIZE, spacing } from '@/ui-kit';

const LEAVE_CLEARANCE = CORNER_BUTTON_SIZE + spacing[3] * 2;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    minWidth: 0,
    gap: spacing[1],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    paddingLeft: spacing[2],
    paddingRight: LEAVE_CLEARANCE
  }
});
