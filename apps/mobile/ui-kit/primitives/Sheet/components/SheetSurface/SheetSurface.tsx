import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SheetSurfaceProps } from './SheetSurface.types';

import { gradientEnds, surfaceGradient } from '../../../../theme';
import { useSheetDrag } from '../../hooks';
import { SHEET_BOTTOM_GAP } from '../../Sheet.config';
import { styles } from '../../Sheet.styles';
import { SheetHeader } from '../SheetHeader';

export const SheetSurface = ({
  isOpen,
  title,
  children,
  footer,
  maxHeight,
  onClose
}: SheetSurfaceProps) => {
  const insets = useSafeAreaInsets();

  const { gesture, slide } = useSheetDrag({ isOpen, maxHeight, onClose });

  return (
    <Animated.View
      style={[
        styles.panel,
        styles.sheet,
        { maxHeight, paddingBottom: insets.bottom + SHEET_BOTTOM_GAP },
        slide
      ]}
    >
      <LinearGradient
        colors={surfaceGradient.raised}
        end={gradientEnds.vertical.end}
        start={gradientEnds.vertical.start}
        style={styles.fill}
      />

      <GestureDetector gesture={gesture}>
        <View style={styles.grabberZone}>
          <View style={styles.grabber} />
        </View>
      </GestureDetector>

      <SheetHeader title={title} onClose={onClose} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {children}
      </ScrollView>

      {footer !== undefined && <View style={styles.footer}>{footer}</View>}
    </Animated.View>
  );
};
