import type { StyleProp, ViewStyle } from 'react-native';

import type { ConnectionStatus } from '../../model';

export type ConnectionPillProps = {
  status: ConnectionStatus;
  style?: StyleProp<ViewStyle>;
};
