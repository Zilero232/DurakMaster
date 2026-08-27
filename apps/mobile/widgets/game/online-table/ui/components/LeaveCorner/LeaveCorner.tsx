import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { LeaveCornerProps } from './LeaveCorner.types';

import { styles } from './LeaveCorner.styles';

export const LeaveCorner = ({ onLeave }: LeaveCornerProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={t('table.leave')}
      accessibilityRole='button'
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
      onPress={onLeave}
    >
      <LogOut color={colors.onFelt} size={iconSize.md} />
    </Pressable>
  );
};
