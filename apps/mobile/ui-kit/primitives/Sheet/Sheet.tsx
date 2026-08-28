import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SheetProps } from './Sheet.types';

import { colors, iconSize } from '../../theme';
import { styles } from './Sheet.styles';

const DIALOG_FROM_WIDTH = 768;

const MAX_HEIGHT_RATIO = { dialog: 0.88, sheet: 0.92 } as const;

export const Sheet = ({ isOpen, title, children, footer, onClose }: SheetProps) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

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

      <Animated.View
        style={[
          styles.panel,
          isDialog ? styles.dialog : styles.sheet,
          {
            maxHeight,
            paddingBottom: isDialog ? 16 : insets.bottom + 16
          }
        ]}
        entering={isDialog ? FadeIn.duration(160) : SlideInDown.duration(240)}
        exiting={isDialog ? FadeOut.duration(140) : SlideOutDown.duration(180)}
      >
        {!isDialog && <View style={styles.grabber} />}

        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>

          <Pressable
            accessibilityLabel={t('common.close')}
            accessibilityRole='button'
            hitSlop={12}
            style={styles.close}
            onPress={onClose}
          >
            <X color={colors.mutedForeground} size={iconSize.md} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          {children}
        </ScrollView>

        {footer && <View style={styles.footer}>{footer}</View>}
      </Animated.View>
    </Modal>
  );
};
