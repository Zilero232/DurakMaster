import { Flag, LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, iconSize } from '@/ui-kit';

import type { MenuFooterProps } from './MenuFooter.types';

import { styles } from './MenuFooter.styles';

export const MenuFooter = ({
  isPlaying,
  isConfirmingSurrender,
  onLeave,
  onCancelSurrender,
  onConfirmSurrender
}: MenuFooterProps) => {
  const { t } = useTranslation();

  if (isConfirmingSurrender) {
    return (
      <View style={styles.row}>
        <Button size='lg' style={styles.half} variant='secondary' onPress={onCancelSurrender}>
          {t('common.cancel')}
        </Button>

        <Button size='lg' style={styles.half} variant='danger' onPress={onConfirmSurrender}>
          {t('table.surrender')}
        </Button>
      </View>
    );
  }

  const Icon = isPlaying ? Flag : LogOut;

  return (
    <Button
      isFullWidth
      icon={(color) => <Icon color={color} size={iconSize.md} />}
      size='lg'
      variant='danger'
      onPress={onLeave}
    >
      {t(isPlaying ? 'table.surrender' : 'table.leave')}
    </Button>
  );
};
