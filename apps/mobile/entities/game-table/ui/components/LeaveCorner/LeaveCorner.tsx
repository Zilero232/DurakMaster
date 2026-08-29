import { Flag, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { TEST_ID } from '@/shared/config';
import { Button, colors, CONFIRM_MAX_WIDTH, iconSize, Sheet } from '@/ui-kit';

import type { LeaveCornerProps } from './LeaveCorner.types';

import { styles } from './LeaveCorner.styles';

export const LeaveCorner = ({ isPlaying = false, onLeave }: LeaveCornerProps) => {
  const { t } = useTranslation();

  const [isConfirming, setIsConfirming] = useState(false);

  const Icon = isPlaying ? Flag : LogOut;

  return (
    <>
      <Pressable
        accessibilityLabel={t(isPlaying ? 'table.surrender' : 'table.leave')}
        accessibilityRole='button'
        style={({ pressed }) => [styles.root, pressed && styles.pressed]}
        testID={TEST_ID.table.leave}
        onPress={() => (isPlaying ? setIsConfirming(true) : onLeave())}
      >
        <Icon color={colors.onFelt} size={iconSize.md} />
      </Pressable>

      <Sheet
        isOpen={isConfirming}
        maxWidth={CONFIRM_MAX_WIDTH}
        title={t('table.surrenderTitle')}
        onClose={() => setIsConfirming(false)}
      >
        <View style={styles.dialog}>
          <Text style={styles.hint}>{t('table.surrenderHint')}</Text>

          <View style={styles.actions}>
            <Button
              size='lg'
              style={styles.action}
              variant='secondary'
              onPress={() => setIsConfirming(false)}
            >
              {t('common.cancel')}
            </Button>

            <Button
              size='lg'
              style={styles.action}
              testID={TEST_ID.table.surrenderConfirm}
              variant='danger'
              onPress={() => {
                setIsConfirming(false);
                onLeave();
              }}
            >
              {t('table.surrender')}
            </Button>
          </View>
        </View>
      </Sheet>
    </>
  );
};
