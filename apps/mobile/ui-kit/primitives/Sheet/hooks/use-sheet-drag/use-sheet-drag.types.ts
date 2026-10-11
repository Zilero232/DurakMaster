import type { ViewStyle } from 'react-native';
import type { GestureType } from 'react-native-gesture-handler';
import type { AnimatedStyle } from 'react-native-reanimated';

export type UseSheetDragInput = {
  isOpen: boolean;

  /** How far the sheet may travel before it counts as dismissed. */
  maxHeight: number;
  onClose: () => void;
};

export type UseSheetDragResult = {
  gesture: GestureType;
  slide: AnimatedStyle<ViewStyle>;
};
