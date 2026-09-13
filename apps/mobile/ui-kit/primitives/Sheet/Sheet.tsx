import { useTranslation } from 'react-i18next';
import { Modal, Pressable, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { SheetProps } from './Sheet.types';

import { SheetSurface } from './components';
import { DIALOG_FROM_WIDTH, MAX_HEIGHT_RATIO } from './Sheet.config';
import { styles } from './Sheet.styles';

export const Sheet = ({ isOpen, title, children, footer, maxWidth, onClose }: SheetProps) => {
  const { t } = useTranslation();

  const { width, height } = useWindowDimensions();

  const isDialog = width >= DIALOG_FROM_WIDTH;

  const maxHeight = height * MAX_HEIGHT_RATIO[isDialog ? 'dialog' : 'sheet'];

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={isOpen}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(160)}
          style={styles.backdrop}
        >
          <Pressable
            accessibilityLabel={t('common.close')}
            style={styles.backdropFill}
            onPress={onClose}
          />
        </Animated.View>

        <SheetSurface
          footer={footer}
          isDialog={isDialog}
          isOpen={isOpen}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          title={title}
          onClose={onClose}
        >
          {children}
        </SheetSurface>
      </GestureHandlerRootView>
    </Modal>
  );
};
