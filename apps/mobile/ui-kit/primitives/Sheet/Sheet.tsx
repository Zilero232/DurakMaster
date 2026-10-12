import { useTranslation } from 'react-i18next';
import { Modal, Pressable, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { SheetProps } from './Sheet.types';

import { SheetSurface } from './components';
import { useSheetPresence } from './hooks';
import { CLOSE_DURATION_MS, MAX_HEIGHT_RATIO } from './Sheet.config';
import { styles } from './Sheet.styles';

export const Sheet = ({ isOpen, title, children, footer, onClose }: SheetProps) => {
  const { t } = useTranslation();

  const { height } = useWindowDimensions();

  const isMounted = useSheetPresence({ isOpen, exitDurationMs: CLOSE_DURATION_MS });

  const maxHeight = height * MAX_HEIGHT_RATIO;

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={isMounted}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          entering={FadeIn.duration(CLOSE_DURATION_MS)}
          exiting={FadeOut.duration(CLOSE_DURATION_MS)}
          style={styles.backdrop}
        >
          <Pressable
            accessibilityLabel={t('common.close')}
            style={styles.backdropFill}
            onPress={onClose}
          />
        </Animated.View>

        <KeyboardAvoidingView behavior='padding' style={styles.keyboardFrame}>
          <SheetSurface
            footer={footer}
            isOpen={isOpen}
            maxHeight={maxHeight}
            title={title}
            onClose={onClose}
          >
            {children}
          </SheetSurface>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};
