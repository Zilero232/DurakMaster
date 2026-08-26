import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SheetProps } from './Sheet.types';

import { colors } from '../../theme';
import { styles } from './Sheet.styles';

export const Sheet = ({ isOpen, title, children, footer, onClose }: SheetProps) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType='slide'
      visible={isOpen}
      onRequestClose={onClose}
    >
      <Pressable accessibilityLabel={t('common.close')} style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.grabber} />

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
            <X color={colors.mutedForeground} size={18} />
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
      </View>
    </Modal>
  );
};
