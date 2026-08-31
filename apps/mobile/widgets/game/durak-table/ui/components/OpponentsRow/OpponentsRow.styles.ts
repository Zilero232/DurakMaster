import { StyleSheet } from 'react-native';

import { CORNER_BUTTON_SIZE, spacing } from '@/ui-kit';

const LEAVE_CLEARANCE = CORNER_BUTTON_SIZE + spacing[4];

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    gap: spacing[2],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[2]
  },

  withLeaveButton: {
    paddingRight: LEAVE_CLEARANCE
  }
});
