import type { TauntId } from '@durak-master/schemas';
import type { StyleProp, ViewStyle } from 'react-native';

export type TauntIconProps = {
  taunt: TauntId;
  size?: number;
  style?: StyleProp<ViewStyle>;
};
