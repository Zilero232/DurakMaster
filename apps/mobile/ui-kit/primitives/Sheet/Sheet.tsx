import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SheetProps } from './Sheet.types';

import { colors, gradientEnds, iconSize, surfaceGradient } from '../../theme';
import { DIALOG_FROM_WIDTH, MAX_HEIGHT_RATIO } from './Sheet.config';
import { styles } from './Sheet.styles';

export const Sheet = ({ isOpen, title, children, footer, maxWidth, onClose }: SheetProps) => {
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
          isDialog && maxWidth ? { maxWidth } : null,
          {
            maxHeight,
            paddingBottom: isDialog ? 16 : insets.bottom + 16
          }
        ]}
        entering={isDialog ? FadeIn.duration(160) : SlideInDown.duration(240)}
        exiting={isDialog ? FadeOut.duration(140) : SlideOutDown.duration(180)}
      >
        <LinearGradient
          colors={surfaceGradient.raised}
          end={gradientEnds.vertical.end}
          start={gradientEnds.vertical.start}
          style={styles.fill}
        />

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
