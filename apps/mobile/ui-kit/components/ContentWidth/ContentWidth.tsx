import { View } from 'react-native';

import type { ContentWidthProps } from './ContentWidth.types';

import { CONTENT_MAX_WIDTH } from '../../theme';
import { styles } from './ContentWidth.styles';

export const ContentWidth = ({
  children,
  maxWidth = CONTENT_MAX_WIDTH,
  style
}: ContentWidthProps) => <View style={[styles.root, { maxWidth }, style]}>{children}</View>;
