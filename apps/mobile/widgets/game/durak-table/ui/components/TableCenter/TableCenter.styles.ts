import { StyleSheet } from 'react-native';

import { opacity, spacing } from '@/ui-kit';

const SIDE_SHARE = '22%';

const FIELD_SHARE = '56%';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4]
  },

  talon: {
    alignItems: 'flex-start',
    width: SIDE_SHARE
  },

  field: {
    alignSelf: 'stretch',
    width: FIELD_SHARE
  },

  discard: {
    alignItems: 'flex-end',
    width: SIDE_SHARE,
    opacity: opacity.muted
  }
});
