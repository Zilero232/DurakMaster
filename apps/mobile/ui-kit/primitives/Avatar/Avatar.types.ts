import type { StyleProp, ViewStyle } from 'react-native';

export type AvatarProps = {
  name: string;
  src?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};
