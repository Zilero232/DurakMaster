import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import type { SheetHeaderProps } from './SheetHeader.types';

import { colors, iconSize } from '../../../../theme';
import { styles } from '../../Sheet.styles';

export const SheetHeader = ({ title, onClose }: SheetHeaderProps) => {
  const { t } = useTranslation();

  return (
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
  );
};
