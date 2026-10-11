import { Flag, LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button, colors, iconSize, Sheet, spacing } from '@/ui-kit';

import type { LeaveButtonProps } from './LeaveButton.types';

import { styles } from './LeaveButton.styles';

export const LeaveButton = ({
  isPlaying = false,
  isConfirming,
  onPress,
  onCancel,
  onConfirm
}: LeaveButtonProps) => {
  const { t } = useTranslation();

  const Icon = isPlaying ? Flag : LogOut;

  return (
    <>
      <Pressable
        accessibilityLabel={t(isPlaying ? 'table.surrender' : 'table.leave')}
        accessibilityRole='button'
        hitSlop={spacing[1]}
        style={({ pressed }) => [styles.root, pressed && styles.pressed]}
        onPress={onPress}
      >
        <Icon color={colors.onFelt} size={iconSize.md} />
      </Pressable>

      <Sheet isOpen={isConfirming} title={t('table.surrenderTitle')} onClose={onCancel}>
        <View style={styles.dialog}>
          <Text style={styles.hint}>{t('table.surrenderHint')}</Text>

          <View style={styles.actions}>
            <Button size='lg' style={styles.action} variant='secondary' onPress={onCancel}>
              {t('common.cancel')}
            </Button>

            <Button size='lg' style={styles.action} variant='danger' onPress={onConfirm}>
              {t('table.surrender')}
            </Button>
          </View>
        </View>
      </Sheet>
    </>
  );
};
