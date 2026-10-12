import { StyleSheet } from 'react-native';

import { opacity, spacing } from '@/ui-kit';

const TALON_SHARE = '30%';

const FIELD_SHARE = '52%';

const DISCARD_SHARE = '18%';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4]
  },

  talon: {
    alignItems: 'flex-start',
    width: TALON_SHARE
  },

  field: {
    alignSelf: 'stretch',
    width: FIELD_SHARE
  },

  discard: {
    alignItems: 'flex-end',
    width: DISCARD_SHARE,
    opacity: opacity.muted
  }
});
